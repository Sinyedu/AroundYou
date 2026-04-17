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
