import { Schema, model } from "mongoose";
import { Notification } from "../interfaces/notification";

const notificationSchema = new Schema<Notification>({
  recipientUserId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: [
      "review_removed",
      "review_report_action_taken",
      "review_report_no_action",
      "review_report_closed",
    ],
    required: true,
  },
  title: { type: String, required: true, maxlength: 140 },
  message: { type: String, required: true, maxlength: 1000 },
  link: { type: String, default: "" },
  reviewId: { type: String, default: "" },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now, index: true },
});

notificationSchema.index({ recipientUserId: 1, readAt: 1, createdAt: -1 });

export const NotificationModel = model<Notification>(
  "Notification",
  notificationSchema,
);
