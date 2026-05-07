import { Request, Response } from "express";
import { AttractionModel } from "../models/attractionModel";
import { CityModel } from "../models/cityModel";
import { ContentSuggestionModel } from "../models/contentSuggestionModel";
import { EventModel } from "../models/eventModel";
import { ContentSuggestionType } from "../interfaces/contentSuggestion";

const REQUIRED_FIELDS: Record<ContentSuggestionType, string[]> = {
  attraction: [
    "name",
    "description",
    "heroImage",
    "price",
    "link",
    "gpsPosition",
  ],
  event: [
    "name",
    "description",
    "heroImage",
    "price",
    "link",
    "gpsPosition",
    "startDate",
    "endDate",
  ],
  city: [
    "name",
    "description",
    "heroImage",
    "commune",
    "region",
    "country",
    "gpsPosition",
    "population",
  ],
};

const SUGGESTION_MODELS = {
  attraction: AttractionModel,
  event: EventModel,
  city: CityModel,
};

function isContentSuggestionType(
  value: unknown,
): value is ContentSuggestionType {
  return value === "attraction" || value === "event" || value === "city";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMissingFields(
  type: ContentSuggestionType,
  payload: Record<string, unknown>,
): string[] {
  return REQUIRED_FIELDS[type].filter((field) => {
    const value = payload[field];

    if (typeof value === "string") {
      return !value.trim();
    }

    return value === undefined || value === null || value === "";
  });
}

export async function createContentSuggestion(
  req: Request,
  res: Response,
): Promise<void> {
  const { type, payload } = req.body as {
    type?: unknown;
    payload?: unknown;
  };

  if (!isContentSuggestionType(type) || !isRecord(payload)) {
    res.status(400).json({ message: "Invalid content suggestion" });
    return;
  }

  const missingFields = getMissingFields(type, payload);

  if (missingFields.length) {
    res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
    return;
  }

  const submittedBy = req.user?.userID;
  const submittedByName = req.user?.userName;

  if (!submittedBy || !submittedByName) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const suggestion = new ContentSuggestionModel({
      type,
      payload,
      submittedBy,
      submittedByName,
    });

    const result = await suggestion.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating content suggestion:", err);
    res.status(500).json({ message: "Error creating content suggestion" });
  }
}

export async function getContentSuggestions(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const status =
      typeof req.query.status === "string" ? req.query.status : "pending";

    const result = await ContentSuggestionModel.find({ status }).sort({
      createdAt: -1,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching content suggestions:", err);
    res.status(500).json({ message: "Error fetching content suggestions" });
  }
}

export async function approveContentSuggestion(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const suggestion = await ContentSuggestionModel.findById(req.params.id);

    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }

    if (suggestion.status !== "pending") {
      res.status(409).json({ message: "Suggestion has already been reviewed" });
      return;
    }

    const Model = SUGGESTION_MODELS[suggestion.type];
    const createdContent = await new Model(suggestion.payload).save();

    suggestion.status = "approved";
    suggestion.reviewedBy = req.user?.userID;
    suggestion.reviewedAt = new Date();
    await suggestion.save();

    res.status(200).json({ suggestion, content: createdContent });
  } catch (err) {
    console.error("Error approving content suggestion:", err);
    res.status(500).json({ message: "Error approving content suggestion" });
  }
}

export async function rejectContentSuggestion(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const suggestion = await ContentSuggestionModel.findById(req.params.id);

    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }

    if (suggestion.status !== "pending") {
      res.status(409).json({ message: "Suggestion has already been reviewed" });
      return;
    }

    suggestion.status = "rejected";
    suggestion.reviewedBy = req.user?.userID;
    suggestion.reviewedAt = new Date();
    suggestion.rejectionReason =
      typeof req.body.reason === "string" ? req.body.reason.trim() : "";
    await suggestion.save();

    res.status(200).json(suggestion);
  } catch (err) {
    console.error("Error rejecting content suggestion:", err);
    res.status(500).json({ message: "Error rejecting content suggestion" });
  }
}
