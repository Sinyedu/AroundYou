import { Document } from "mongoose";

export type ContactTicketCategory =
  | "bug"
  | "report"
  | "account"
  | "content"
  | "other";

export type ContactTicketStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "rejected";

export interface ContactTicket extends Document {
  category: ContactTicketCategory;
  status: ContactTicketStatus;
  subject: string;
  message: string;
  submittedBy: string;
  submittedByName: string;
  submittedByEmail: string;
  seenBy?: string;
  seenAt?: Date;
  inProgressBy?: string;
  inProgressAt?: Date;
  completedBy?: string;
  completedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
