import { Document } from "mongoose";

export type NotificationType =
  | "review_removed"
  | "review_report_action_taken"
  | "review_report_no_action"
  | "contact_ticket_seen"
  | "contact_ticket_in_progress"
  | "contact_ticket_completed"
  | "contact_ticket_reopened"
  | "contact_ticket_rejected";

export interface Notification extends Document {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  reviewId?: string;
  readAt?: Date;
  createdAt: Date;
}
