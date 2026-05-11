import { Router } from "express";
import {
  deleteAllNotifications,
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.get("/notifications", verifyToken, getMyNotifications);
router.delete("/notifications", verifyToken, deleteAllNotifications);
router.patch("/notifications/read-all", verifyToken, markAllNotificationsRead);
router.patch("/notifications/:id/read", verifyToken, markNotificationRead);

export default router;
