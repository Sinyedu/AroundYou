import { Router } from "express";
import { createContentSuggestion } from "../controllers/contentSuggestionController";
import { contentWriteRateLimiter } from "../middleware/rateLimit";
import { requirePermission } from "../middleware/requirePermission";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post(
  "/suggestions",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("content:suggest"),
  createContentSuggestion,
);

export default router;
