import { Document } from "mongoose";

export type ContactTicketCategory =
  | "bug"
  | "report"
  | "account"
  | "content"
  | "other";

export type ContactTicketStatus = "open" | "completed";

export interface ContactTicket extends Document {
  category: ContactTicketCategory;
  status: ContactTicketStatus;
  subject: string;
  message: string;
  submittedBy: string;
  submittedByName: string;
  submittedByEmail: string;
  completedBy?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
