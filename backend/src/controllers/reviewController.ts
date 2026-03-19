import { Request, Response } from "express";
import { ReviewModel } from "../models/reviewModel";
import { connectionToDatabase, disconnectFromDatabase } from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";


/**
 * Add new REVIEW to the database
 * @param req
 * @param res
 */
export async function createReview(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connectionToDatabase();

    const review = new ReviewModel(data);
    const result = await review.save();

    res.status(201).json(result);
  }
  catch (err) {
    console.error("Error creating review:", err);

    res.status(500).json("An error occurred while creating the review." + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}