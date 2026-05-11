import { Router } from "express";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventByGenericQuery,
  getEventById,
  getEventByQuery,
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
router.get(
  "/events/query/:key/:value",
  verifyToken,
  requirePermission("event:read"),
  getEventByQuery,
);
router.post(
  "/events/query",
  verifyToken,
  requirePermission("event:read"),
  getEventByGenericQuery,
);

export default router;
