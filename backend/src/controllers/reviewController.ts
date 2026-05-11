import { Request, Response } from "express";
import Joi from "joi";
import { Types } from "mongoose";
import { NotificationModel } from "../models/notificationModel";
import { ReviewModel } from "../models/reviewModel";
import { UserModel } from "../models/userModel";
import { buildDynamicQuery } from "../utils/dynamicQueryBuilder";
import {
  getHideUpdate,
  getRestoreUpdate,
  isValidationError,
  visibleFilter,
} from "./controllerUtils";

function canModifyReview(req: Request, author: string): boolean {
  return req.user?.role === "admin" || req.user?.userName === author;
}

async function getReviewAuthorUserId(author: string): Promise<string | null> {
  const user = await UserModel.findOne({ userName: author }).select("_id");
  return user?._id.toString() ?? null;
}

function uniqueUserIds(userIds: Array<string | null | undefined>): string[] {
  return [...new Set(userIds.filter((userId): userId is string => !!userId))];
}

async function notifyReviewReporters(
  review: {
    _id: Types.ObjectId;
    title: string;
    reports: { reportedBy: string }[];
  },
  actionTaken: boolean,
): Promise<void> {
  const recipients = uniqueUserIds(
    review.reports.map((report) => report.reportedBy),
  );
  if (recipients.length === 0) return;

  await NotificationModel.insertMany(
    recipients.map((recipientUserId) => ({
      recipientUserId,
      type: actionTaken
        ? "review_report_action_taken"
        : "review_report_no_action",
      title: actionTaken ? "Din rapport er behandlet" : "Din rapport er lukket",
      message: actionTaken
        ? `Tak for din rapport. Anmeldelsen "${review.title}" er blevet fjernet efter gennemgang.`
        : `Tak for din rapport. Anmeldelsen "${review.title}" er gennemgået, og der blev ikke fundet regelbrud.`,
      reviewId: review._id.toString(),
    })),
  );
}

async function notifyReviewAuthorReviewRemoved(review: {
  _id: Types.ObjectId;
  author: string;
  title: string;
}): Promise<void> {
  const authorUserId = await getReviewAuthorUserId(review.author);
  if (!authorUserId) return;

  await NotificationModel.create({
    recipientUserId: authorUserId,
    type: "review_removed",
    title: "Din anmeldelse er fjernet",
    message: `Din anmeldelse "${review.title}" er blevet fjernet efter en moderatorgennemgang.`,
    reviewId: review._id.toString(),
  });
}

async function notifyReviewAuthorReportClosed(review: {
  _id: Types.ObjectId;
  author: string;
  title: string;
}): Promise<void> {
  const authorUserId = await getReviewAuthorUserId(review.author);
  if (!authorUserId) return;

  await NotificationModel.create({
    recipientUserId: authorUserId,
    type: "review_report_closed",
    title: "En rapport om din anmeldelse er lukket",
    message: `En rapport om din anmeldelse "${review.title}" er blevet gennemgået og lukket uden yderligere handling.`,
    reviewId: review._id.toString(),
  });
}

const reviewBodySchema = Joi.object({
  targetId: Joi.string().trim().min(1).max(255).required(),
  targetType: Joi.string().valid("city", "event", "attraction").required(),
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().trim().min(6).max(1024).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  image: Joi.string().trim().max(2048).allow("").default(""),
});

const reviewUpdateSchema = Joi.object({
  targetId: Joi.any().forbidden(),
  targetType: Joi.any().forbidden(),
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().trim().min(6).max(1024),
  rating: Joi.number().integer().min(1).max(5),
  image: Joi.string().trim().max(2048).allow(""),
}).min(1);

function validateReviewBody(
  payload: Record<string, unknown>,
  isUpdate = false,
): Record<string, unknown> {
  const { error, value } = (
    isUpdate ? reviewUpdateSchema : reviewBodySchema
  ).validate(payload, {
    abortEarly: false,
    convert: true,
    noDefaults: isUpdate,
    stripUnknown: true,
  });

  if (error) {
    const validationError = new Error(
      error.details.map((detail) => detail.message).join(", "),
    );
    validationError.name = "ValidationError";
    throw validationError;
  }

  return value as Record<string, unknown>;
}

/**
 * CREATE REVIEW
 */
export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const author = req.user?.userName;

    if (!author) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const reviewBody = validateReviewBody(req.body as Record<string, unknown>);

    const review = new ReviewModel({
      ...reviewBody,
      author,
    });
    const result = await review.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating review:", err);
    if (isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({
      message: "Error creating review",
    });
  }
}

/**
 * GET ALL REVIEWS
 */
export async function getAllReviews(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await ReviewModel.find(visibleFilter(req));
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({
      message: "Error retrieving reviews",
    });
  }
}

/**
 * GET REVIEW BY ID
 */
export async function getReviewById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await ReviewModel.findOne({
      _id: req.params.id,
      ...visibleFilter(req),
    });

    if (!result) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({
      message: "Error retrieving review",
    });
  }
}

/**
 * UPDATE REVIEW
 */
export async function updateReviewById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const review = await ReviewModel.findOne({
      _id: req.params.id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (!canModifyReview(req, review.author)) {
      res.status(403).json({ message: "Cannot modify another user's review" });
      return;
    }

    const updates = {
      ...validateReviewBody(req.body as Record<string, unknown>, true),
      ...(typeof req.body.likes === "number" && req.user?.role === "admin"
        ? { likes: req.body.likes }
        : {}),
    };

    const result = await ReviewModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Review updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating review:", err);
    if (isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({
      message: "Error updating review",
    });
  }
}

/**
 * HIDE REVIEW
 */
export async function deleteReviewById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const review = await ReviewModel.findOne({
      _id: req.params.id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (!canModifyReview(req, review.author)) {
      res.status(403).json({ message: "Cannot delete another user's review" });
      return;
    }

    const result = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      getHideUpdate(req.user?.userID),
      { new: true },
    );

    if (req.user?.role === "admin") {
      await notifyReviewAuthorReviewRemoved(review);
      if (review.reports.length > 0) {
        await notifyReviewReporters(review, true);
      }
    }

    res
      .status(200)
      .json({ message: "Review hidden successfully", data: result });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      message: "Error deleting review",
    });
  }
}

export async function restoreReviewById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const review = await ReviewModel.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    const result = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      getRestoreUpdate(),
      { new: true },
    );

    res.status(200).json({
      message: "Review restored successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error restoring review:", err);
    res.status(500).json({
      message: "Error restoring review",
    });
  }
}

/**
 * QUERY REVIEW (KEY / VALUE)
 */
export async function getReviewByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await ReviewModel.find({
      ...visibleFilter(req),
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error querying reviews:", err);
    res.status(500).json({
      message: "Error retrieving reviews by query",
    });
  }
}

/**
 * GENERIC QUERY
 */
export async function getReviewByGenericQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const query = buildDynamicQuery(ReviewModel, req.body);

    const result = await ReviewModel.find({
      ...query,
      ...visibleFilter(req),
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic review query:", err);
    res.status(500).json({
      message: "Error retrieving reviews",
    });
  }
}

/**
 * GET REVIEWS BY TARGET (city / event / attraction)
 */
export async function getReviewsByTarget(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { targetId } = req.params;
    const result = await ReviewModel.find({
      targetId,
      ...visibleFilter(req),
    }).sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching reviews by target:", err);
    res.status(500).json({ message: "Error retrieving reviews" });
  }
}

/**
 * EDIT OWN REVIEW (sets edited: true)
 */
export async function editReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updates = validateReviewBody(
      req.body as Record<string, unknown>,
      true,
    );

    const review = await ReviewModel.findOne({
      _id: id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (!canModifyReview(req, review.author)) {
      res.status(403).json({ message: "Cannot modify another user's review" });
      return;
    }

    const updated = await ReviewModel.findByIdAndUpdate(
      id,
      {
        ...updates,
        edited: true,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error editing review:", err);
    if (isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: "Error updating review" });
  }
}

/**
 * LIKE / UNLIKE REVIEW (toggle)
 */
export async function likeReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.userID;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const review = await ReviewModel.findOne({
      _id: id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    const likedBy = review.likedBy ?? [];
    const alreadyLiked = likedBy.includes(userId);

    const updated = await ReviewModel.findByIdAndUpdate(
      id,
      alreadyLiked
        ? { $pull: { likedBy: userId }, $inc: { likes: -1 } }
        : { $addToSet: { likedBy: userId }, $inc: { likes: 1 } },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error liking review:", err);
    res.status(500).json({ message: "Error updating like" });
  }
}

export async function reportReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const reportedBy = req.user?.userID;
    const reason =
      typeof req.body.reason === "string" ? req.body.reason.trim() : "";
    const safeReason = reason.slice(0, 500);

    if (!reportedBy) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const review = await ReviewModel.findOne({
      _id: id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    const alreadyReported = review.reports.some(
      (report) => report.reportedBy === reportedBy,
    );

    if (alreadyReported) {
      res.status(409).json({ message: "Review already reported by user" });
      return;
    }

    review.reports.push({
      reportedBy,
      reason: safeReason,
      createdAt: new Date(),
    });
    review.reportCount = review.reports.length;
    review.reportResolved = false;
    review.reportResolvedAt = undefined;
    review.reportResolvedBy = undefined;

    const result = await review.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Error reporting review:", err);
    res.status(500).json({ message: "Error reporting review" });
  }
}

export async function getReportedReviews(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const includeResolved = req.query.includeResolved === "true";

    const result = await ReviewModel.find({
      reportCount: { $gt: 0 },
      ...visibleFilter(req),
      ...(includeResolved ? {} : { reportResolved: false }),
    }).sort({ reportCount: -1, createdAt: -1 });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching reported reviews:", err);
    res.status(500).json({ message: "Error retrieving reported reviews" });
  }
}

export async function resolveReviewReport(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const review = await ReviewModel.findById(req.params.id);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    review.reportResolved = true;
    review.reportResolvedAt = new Date();
    review.reportResolvedBy = req.user?.userID;

    const result = await review.save();
    await notifyReviewAuthorReportClosed(review);
    await notifyReviewReporters(review, false);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error resolving review report:", err);
    res.status(500).json({ message: "Error resolving review report" });
  }
}
