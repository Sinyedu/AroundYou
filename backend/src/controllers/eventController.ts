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
 * Retrieve all EVENTS from the database
 * @param req
 * @param res
 */
export async function getAllEvents(req: Request, res: Response) {
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

/**
 * Retrieve an EVENT by ID from the database
 * @param req
 * @param res 
 */
export async function getEventById(req: Request, res: Response) {
  try {
    await connectionToDatabase();

    const eventId = req.params.id;
    const result = await EventModel.findById(eventId);

    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).json("error retrieving event by ID. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Update an EVENT by ID from the database
 * @param req
 * @param res
 */
export async function updateEventById(req: Request, res: Response) {

  const eventId = req.params.id;

  try {
    await connectionToDatabase();

    const result = await EventModel.findByIdAndUpdate(eventId, req.body);

    if (!result) {
      res.status(404).json("Cannot find event with id=: " + eventId);
    } else {
      res.status(200).json("Event was updated successfully.");
    }
  }
  catch (err) {
    res.status(500).json("Error updating the event by id. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete an EVENT by ID from the database
 * @param req
 * @param res
 */
export async function deleteEventById(req: Request, res: Response) {
  const eventId = req.params.id;

  try {
    await connectionToDatabase();

    const result = await EventModel.findByIdAndDelete(eventId);

    if (!result) {
      res.status(404).json("Cannot find event with id=: " + eventId);
    } else {
      res.status(200).json("Event was deleted successfully.");
    }
  }
  catch (err) {
    res.status(500).json("Error deleting the event by id. Error: " + err);
  }
  finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieve an EVENT by query from the database
 * @param req
 * @param res
 */
export async function getEventByQuery(req: Request, res: Response): Promise<void> {

  try {
    await connectionToDatabase();

    const key: any = req.params.key;
    const value: any = req.params.value;

    const result = await EventModel.find({ [key]: {$regex: value, $options: 'i'} });

    res.status(200).json(result);
    
  } catch (err) {
      res.status(500).json("error retrieving event by query. Error: " + err);
  } finally {
      await disconnectFromDatabase();
  }
}