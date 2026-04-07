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

/**
 * Retrieve all REVIEWS from the database
 * @param req
 * @param res
 */
export async function getAllReviews(req: Request, res: Response) {
  try {
    await connectionToDatabase();

    const result = await ReviewModel.find({});

    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).json("error retrieving the reviews." + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieve a REVIEW by ID from the database
 * @param req
 * @param res 
 */
export async function getReviewById(req: Request, res: Response) {
  try {
    await connectionToDatabase();

    const reviewId = req.params.id;
    const result = await ReviewModel.findById(reviewId);

    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).json("error retrieving review by ID. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Update a REVIEW by ID from the database
 * @param req
 * @param res
 */
export async function updateReviewById(req: Request, res: Response) {

  const reviewId = req.params.id;

  try {
    await connectionToDatabase();

    const result = await ReviewModel.findByIdAndUpdate(reviewId, req.body);

    if (!result) {
      res.status(404).json("Cannot find review with id=: " + reviewId);
    } else {
      res.status(200).json("Review was updated successfully.");
    }
  }
  catch (err) {
    res.status(500).json("Error updating the review by id. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete a REVIEW by ID from the database
 * @param req
 * @param res
 */
export async function deleteReviewById(req: Request, res: Response) {
  const reviewId = req.params.id;

  try {
    await connectionToDatabase();

    const result = await ReviewModel.findByIdAndDelete(reviewId);

    if (!result) {
      res.status(404).json("Cannot find review with id=: " + reviewId);
    } else {
      res.status(200).json("Review was deleted successfully.");
    }
  }
  catch (err) {
    res.status(500).json("Error deleting the review by id. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieve a REVIEW by query from the database
 * @param req
 * @param res
 */
export async function getReviewByQuery(req: Request, res: Response): Promise<void> {

  try {
    await connectionToDatabase();

    const key: any = req.params.key;
    const value: any = req.params.value;

    const result = await ReviewModel.find({ [key]: {$regex: value, $options: 'i'} });

    res.status(200).json(result);
    
  } 
  catch (err) {
    res.status(500).json("error retrieving review by query. Error: " + err);
  }
  finally {
     await disconnectFromDatabase();
  }
}

/**
 * Retrieve a REVIEW by query from the database with a dynamic query builder
 * @param req
 * @param res
 */
export async function getReviewByGenericQuery(req: Request, res: Response): Promise<void> {
  
  try {
    await connectionToDatabase();

    const body = req.body;

    const result = await ReviewModel.find(buildDynamicQuery(ReviewModel, body)); 

    res.status(200).json(result);

  }
  catch (err) {
    res.status(500).json("error retrieving review by generic query. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}