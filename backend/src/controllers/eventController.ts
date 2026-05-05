import { Request, Response } from "express";
import { EventModel } from "../models/eventModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

function shouldIncludeHidden(req: Request): boolean {
  return req.originalUrl.startsWith("/api/admin/");
}

function visibleFilter(req: Request): Record<string, unknown> {
  if (!shouldIncludeHidden(req)) {
    return { isHidden: { $ne: true } };
  }

  if (req.query.visibility === "hidden") {
    return { isHidden: true };
  }

  if (req.query.visibility === "all") {
    return {};
  }

  return { isHidden: { $ne: true } };
}

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
    const result = await EventModel.find(visibleFilter(req));
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
    const result = await EventModel.findOne({
      _id: req.params.id,
      ...visibleFilter(req),
    });

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
 * HIDE EVENT
 */
export async function deleteEventById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await EventModel.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: true,
        hiddenAt: new Date(),
        hiddenBy: req.user?.userID,
      },
      { new: true },
    );

    if (!result) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ message: "Event hidden successfully", data: result });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({
      message: "Error deleting event",
    });
  }
}

export async function restoreEventById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await EventModel.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: false,
        $unset: { hiddenAt: "", hiddenBy: "" },
      },
      { new: true },
    );

    if (!result) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ message: "Event restored successfully", data: result });
  } catch (err) {
    console.error("Error restoring event:", err);
    res.status(500).json({
      message: "Error restoring event",
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
      ...visibleFilter(req),
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

    const result = await EventModel.find({
      ...query,
      ...visibleFilter(req),
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic event query:", err);
    res.status(500).json({
      message: "Error retrieving events",
    });
  }
}
