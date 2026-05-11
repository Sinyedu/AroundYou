import { Document } from "mongoose";

export type NotificationType =
  | "review_removed"
  | "review_report_action_taken"
  | "review_report_no_action"
  | "review_report_closed";

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
