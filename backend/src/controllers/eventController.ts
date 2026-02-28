import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import {
  connectionToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";
import { EventModel } from "../models/eventModel";

// CRUD

/**
 * Add new EVENT to the database
 * @param req
 * @param res
 */
export async function createEvent(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connectionToDatabase();

    const event = new EventModel(data);
    const result = await event.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating event:", err); // Add this line

    res.status(500).json("An error occurred while creating the event." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieves all EVENTS from the database
 * @param req
 * @param res
 */
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    await connectionToDatabase();

    const result = await EventModel.find({});

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving the events." + err);
  } finally {
    await disconnectFromDatabase();
  }
}
