import { Request, Response } from "express";
import { AttractionModel } from "../models/attractionModel";
import { buildDynamicQuery } from "../controllers/dynamicQueryBuilder";

/**
 * Create new attraction
 */
export async function createAttraction(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const attraction = new AttractionModel(req.body);
    const result = await attraction.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating attraction:", err);

    if (
      err instanceof Error &&
      "name" in err &&
      err.name === "ValidationError"
    ) {
      res.status(400).json({
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      message: "An error occurred while creating the attraction",
    });
  }
}

/**
 * Get all attractions
 */
export async function getAllAttractions(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await AttractionModel.find({}).sort({ updateAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving attractions:", err);
    res.status(500).json({
      message: "Error retrieving attractions",
    });
  }
}

/**
 * Get attraction by ID
 */
export async function getAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    const result = await AttractionModel.findById(id);

    if (!result) {
      res.status(404).json({ message: "Attraction not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving attraction by id:", err);
    res.status(500).json({
      message: "Error retrieving attraction by id",
    });
  }
}

/**
 * Update attraction by ID
 */
export async function updateAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    const result = await AttractionModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!result) {
      res.status(404).json({
        message: `Cannot find attraction with id=${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "Attraction updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating attraction:", err);
    res.status(500).json({
      message: "Error updating attraction",
    });
  }
}

/**
 * Delete attraction by ID
 */
export async function deleteAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;

    const result = await AttractionModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).json({
        message: `Cannot find attraction with id=${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "Attraction deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting attraction:", err);
    res.status(500).json({
      message: "Error deleting attraction",
    });
  }
}

/**
 * Search attractions by simple query (key/value)
 */
export async function getAttractionsByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await AttractionModel.find({
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error querying attractions:", err);
    res.status(500).json({
      message: "Error retrieving attractions by query",
    });
  }
}

/**
 * Advanced dynamic query builder
 */
export async function getAttractionsByQueryGeneric(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const body = req.body;

    const query = buildDynamicQuery(AttractionModel, body);

    const result = await AttractionModel.find(query);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving attractions (generic query):", err);
    res.status(500).json({
      message: "Error retrieving attractions by generic query",
    });
  }
}
