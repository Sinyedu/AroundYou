import { Router } from "express";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.get("/notifications", verifyToken, getMyNotifications);
router.patch("/notifications/read-all", verifyToken, markAllNotificationsRead);
router.patch("/notifications/:id/read", verifyToken, markNotificationRead);

export default router;
