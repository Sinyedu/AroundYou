import { Request, Response } from "express";
import { ReviewModel } from "../models/reviewModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";
import { pickTrimmedStringFields } from "../utils/stringFields";


function shouldIncludeHidden(req: Request): boolean {
  return req.originalUrl.startsWith("/api/admin/");
}

function visibleFilter(req: Request): Record<string, unknown> {
  if (!shouldIncludeHidden(req)) {
    return { isHidden: { $ne: true } };
  }

  if (req.query.visibility === "hidden") {
    return { isHidden: true };
  }

  if (req.query.visibility === "all") {
    return {};
  }

  return { isHidden: { $ne: true } };
}

function canModifyReview(req: Request, author: string): boolean {
  return req.user?.role === "admin" || req.user?.userName === author;
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

    const review = new ReviewModel({
      ...req.body,
      author,
    });
    const result = await review.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating review:", err);
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
      ...pickTrimmedStringFields(req.body as Record<string, unknown>, [
        "title",
        "description",
        "image",
      ]),
      ...(typeof req.body.rating === "number"
        ? { rating: req.body.rating }
        : {}),
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
      {
        isHidden: true,
        hiddenAt: new Date(),
        hiddenBy: req.user?.userID,
      },
      { new: true },
    );

    res.status(200).json({ message: "Review hidden successfully", data: result });
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
      {
        isHidden: false,
        $unset: { hiddenAt: "", hiddenBy: "" },
      },
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
export async function getReviewsByTarget(req: Request, res: Response): Promise<void> {
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
    const { title, description, rating, image } = req.body as {
      title?: string;
      description?: string;
      rating?: number;
      image?: string;
    };

    const review = await ReviewModel.findOne({
      _id: id,
      ...visibleFilter(req),
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    const updated = await ReviewModel.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(rating !== undefined && { rating }),
        ...(image !== undefined && { image }),
        edited: true,
      },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error editing review:", err);
    res.status(500).json({ message: "Error updating review" });
  }
}

/**
 * LIKE / UNLIKE REVIEW (toggle)
 */
export async function likeReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.body.userId as string;

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
      reason,
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
    const visibilityFilter =
      req.query.visibility === "hidden"
        ? { isHidden: true }
        : req.query.visibility === "all"
          ? {}
          : { isHidden: { $ne: true } };

    const result = await ReviewModel.find({
      reportCount: { $gt: 0 },
      ...visibilityFilter,
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
    res.status(200).json(result);
  } catch (err) {
    console.error("Error resolving review report:", err);
    res.status(500).json({ message: "Error resolving review report" });
  }
}
