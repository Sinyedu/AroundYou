import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { AttractionModel } from "../models/attractionModel";
import {
  connectionToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

// CRUD YEAH

/**
 * Add new ATTRACTION to the database
 * @param req
 * @param res
 */
export async function createAttraction(
  req: Request,
  res: Response,
): Promise<void> {
  const data = req.body;

  try {
    await connectionToDatabase();

    const attraction = new AttractionModel(data);
    const result = await attraction.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating attraction:", err); // Add this line

    res
      .status(500)
      .json("An error occurred while creating the attraction." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieves all ATTRACTIONS from the database
 * @param req
 * @param res
 */
export async function getAllAttractions(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectionToDatabase();

    const result = await AttractionModel.find({});

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving the attractions." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieves an ATTRACTION by ID from the database
 * @param req
 * @param res
 */
export async function getAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectionToDatabase();

    const id = req.params.id;
    const result = await AttractionModel.findById({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving attraction by id." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Update a ATTRACTION by ID from the database
 * @param req
 * @param res
 */
export async function updateAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = req.params.id;

  try {
    await connectionToDatabase();

    const result = await AttractionModel.findByIdAndUpdate(id, req.body);
    if (!result) {
      res.status(404).send("can not update attraction with the id=" + id);
    } else {
      res.status(200).send("attraction was updated successfully.");
    }
  } catch (err) {
    res.status(500).json("error updating the attraction by id." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete an ATTRACTION by ID from the database
 * @param req
 * @param res
 */
export async function deleteAttractionById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = req.params.id;

  try {
    await connectionToDatabase();

    const result = await AttractionModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send("can not delete attraction with the id=" + id);
    } else {
      res.status(200).send("attraction was deleted successfully.");
    }
  } catch (err) {
    res.status(500).json("error deleting the attraction by id." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieves an ATTRACTION by query from the database
 * @param req
 * @param res
 */
export async function getAttractionsByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectionToDatabase();

    // api/products/key/value
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await AttractionModel.find({
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving attraction by query." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieves an ATTRACTION by query from the database
 * @param req
 * @param res
 */
export async function getAttractionsByQueryGeneric(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectionToDatabase();

    // api/products/query

    const body = req.body;

    const result = await AttractionModel.find(
      buildDynamicQuery(AttractionModel, body),
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving attraction by query." + err);
  } finally {
    await disconnectFromDatabase();
  }
}
