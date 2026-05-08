import { Request, Response } from "express";
import { getRouteParam, sendCreateError, visibleFilter } from "./controllerUtils";
import {
  createAttractionRecord,
  findAttractionById,
  findAttractions,
  hideAttractionRecord,
  queryAttractions,
  queryAttractionsByField,
  restoreAttractionRecord,
  updateAttractionRecord,
} from "../services/attraction.service";

/**
 * Create new attraction
 */
export async function createAttraction(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await createAttractionRecord(
      req.body as Record<string, unknown>,
    );

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating attraction:", err);
    sendCreateError(res, err, "An error occurred while creating the attraction");
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
    const result = await findAttractions(visibleFilter(req));
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
    const id = getRouteParam(req.params.id);

    const result = await findAttractionById(id, visibleFilter(req));

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
    const id = getRouteParam(req.params.id);

    const result = await updateAttractionRecord(
      id,
      req.body as Record<string, unknown>,
    );

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
 * Hide attraction by ID
 */
export async function deleteAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = getRouteParam(req.params.id);

    const result = await hideAttractionRecord(id, req.user?.userID);

    if (!result) {
      res.status(404).json({
        message: `Cannot find attraction with id=${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "Attraction hidden successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error deleting attraction:", err);
    res.status(500).json({
      message: "Error deleting attraction",
    });
  }
}

export async function restoreAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = getRouteParam(req.params.id);

    const result = await restoreAttractionRecord(id);

    if (!result) {
      res.status(404).json({
        message: `Cannot find attraction with id=${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "Attraction restored successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error restoring attraction:", err);
    res.status(500).json({
      message: "Error restoring attraction",
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

    const result = await queryAttractionsByField(key, value, visibleFilter(req));

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
    const result = await queryAttractions(req.body, visibleFilter(req));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving attractions (generic query):", err);
    res.status(500).json({
      message: "Error retrieving attractions by generic query",
    });
  }
}
