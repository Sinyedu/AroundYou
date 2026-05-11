import { Request, Response } from "express";
import { NotificationModel } from "../models/notificationModel";

export async function getMyNotifications(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const recipientUserId = req.user?.userID;

    if (!recipientUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await NotificationModel.find({ recipientUserId })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
}

export async function markNotificationRead(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const recipientUserId = req.user?.userID;

    if (!recipientUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, recipientUserId },
      { readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ message: "Error updating notification" });
  }
}

export async function markAllNotificationsRead(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const recipientUserId = req.user?.userID;

    if (!recipientUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await NotificationModel.updateMany(
      { recipientUserId, readAt: { $exists: false } },
      { readAt: new Date() },
    );

    const notifications = await NotificationModel.find({ recipientUserId })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error marking notifications read:", err);
    res.status(500).json({ message: "Error updating notifications" });
  }
}

export async function deleteAllNotifications(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const recipientUserId = req.user?.userID;

    if (!recipientUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await NotificationModel.deleteMany({ recipientUserId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    res.status(500).json({ message: "Error deleting notifications" });
  }
}
