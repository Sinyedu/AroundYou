import { Router } from "express";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventById,
} from "../controllers/eventController";
import { contentWriteRateLimiter } from "../middleware/rateLimit";
import { requirePermission } from "../middleware/requirePermission";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post(
  "/events",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("event:create"),
  createEvent,
);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.put(
  "/events/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("event:update"),
  updateEventById,
);
router.delete(
  "/events/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("event:delete"),
  deleteEventById,
);

export default router;
