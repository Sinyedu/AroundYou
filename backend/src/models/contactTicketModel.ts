import { Schema, model } from "mongoose";
import { ContactTicket } from "../interfaces/contactTicket";

export const CONTACT_TICKET_CATEGORIES = [
  "bug",
  "report",
  "account",
  "content",
  "other",
] as const;

const contactTicketSchema = new Schema<ContactTicket>(
  {
    category: {
      type: String,
      enum: CONTACT_TICKET_CATEGORIES,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "rejected"],
      default: "open",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 140,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 3000,
      trim: true,
    },
    submittedBy: { type: String, required: true, index: true },
    submittedByName: { type: String, required: true },
    submittedByEmail: { type: String, required: true },
    seenBy: { type: String },
    seenAt: { type: Date },
    inProgressBy: { type: String },
    inProgressAt: { type: Date },
    completedBy: { type: String },
    completedAt: { type: Date },
    rejectedBy: { type: String },
    rejectedAt: { type: Date },
    rejectionReason: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

export const ContactTicketModel = model<ContactTicket>(
  "ContactTicket",
  contactTicketSchema,
);
