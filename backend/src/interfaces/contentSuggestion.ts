import { Document } from "mongoose";

export type ContentSuggestionType = "attraction" | "event" | "city";
export type ContentSuggestionStatus = "pending" | "approved" | "rejected";

export interface ContentSuggestion extends Document {
  type: ContentSuggestionType;
  status: ContentSuggestionStatus;
  payload: Record<string, unknown>;
  submittedBy: string;
  submittedByName: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
