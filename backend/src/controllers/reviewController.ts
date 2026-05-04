import { Request, Response } from "express";
import { ReviewModel } from "../models/reviewModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

/**
 * CREATE REVIEW
 */
export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const review = new ReviewModel(req.body);
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
export async function getAllReviews(req: Request, res: Response): Promise<void> {
  try {
    const result = await ReviewModel.find({});
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
export async function getReviewById(req: Request, res: Response): Promise<void> {
  try {
    const result = await ReviewModel.findById(req.params.id);

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
export async function updateReviewById(req: Request, res: Response): Promise<void> {
  try {
    const result = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!result) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

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
 * DELETE REVIEW
 */
export async function deleteReviewById(req: Request, res: Response): Promise<void> {
  try {
    const result = await ReviewModel.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      message: "Error deleting review",
    });
  }
}

/**
 * QUERY REVIEW (KEY / VALUE)
 */
export async function getReviewByQuery(req: Request, res: Response): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await ReviewModel.find({
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
export async function getReviewByGenericQuery(req: Request, res: Response): Promise<void> {
  try {
    const query = buildDynamicQuery(ReviewModel, req.body);

    const result = await ReviewModel.find(query);

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
    const result = await ReviewModel.find({ targetId }).sort({ createdAt: -1 });
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

    const review = await ReviewModel.findById(id);

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

    const review = await ReviewModel.findById(id);

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
