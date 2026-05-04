import { Request, Response } from "express";
import { EventModel } from "../models/eventModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

/**
 * CREATE EVENT
 */
export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const event = new EventModel(req.body);
    const result = await event.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating event:", err);

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
      message: "Error creating event",
    });
  }
}

/**
 * GET ALL EVENTS
 */
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const result = await EventModel.find({});
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({
      message: "Error retrieving events",
    });
  }
}

/**
 * GET EVENT BY ID
 */
export async function getEventById(req: Request, res: Response): Promise<void> {
  try {
    const result = await EventModel.findById(req.params.id);

    if (!result) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({
      message: "Error retrieving event",
    });
  }
}

/**
 * UPDATE EVENT
 */
export async function updateEventById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!result) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({
      message: "Event updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({
      message: "Error updating event",
    });
  }
}

/**
 * DELETE EVENT
 */
export async function deleteEventById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await EventModel.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({
      message: "Error deleting event",
    });
  }
}

/**
 * QUERY EVENT (KEY / VALUE)
 */
export async function getEventByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await EventModel.find({
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error querying events:", err);
    res.status(500).json({
      message: "Error retrieving events by query",
    });
  }
}

/**
 * GENERIC QUERY
 */
export async function getEventByGenericQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const query = buildDynamicQuery(EventModel, req.body);

    const result = await EventModel.find(query);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic event query:", err);
    res.status(500).json({
      message: "Error retrieving events",
    });
  }
}
