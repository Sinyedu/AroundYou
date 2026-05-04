import { Schema, model } from "mongoose";
import { ContentSuggestion } from "../interfaces/contentSuggestion";

const contentSuggestionSchema = new Schema<ContentSuggestion>(
  {
    type: {
      type: String,
      enum: ["attraction", "event", "city"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    submittedBy: {
      type: String,
      required: true,
    },
    submittedByName: {
      type: String,
      required: true,
    },
    reviewedBy: {
      type: String,
      required: false,
    },
    reviewedAt: {
      type: Date,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export const ContentSuggestionModel = model<ContentSuggestion>(
  "ContentSuggestion",
  contentSuggestionSchema,
);
