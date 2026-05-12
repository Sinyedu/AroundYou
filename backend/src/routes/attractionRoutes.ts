import { Router } from "express";
import {
  createAttraction,
  deleteAttractionById,
  getAllAttractions,
  getAttractionById,
  updateAttractionById,
} from "../controllers/attractionController";
import { contentWriteRateLimiter } from "../middleware/rateLimit";
import { requirePermission } from "../middleware/requirePermission";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post(
  "/attractions",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("attraction:create"),
  createAttraction,
);
router.get("/attractions", getAllAttractions);
router.get("/attractions/:id", getAttractionById);
router.put(
  "/attractions/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("attraction:update"),
  updateAttractionById,
);
router.delete(
  "/attractions/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("attraction:delete"),
  deleteAttractionById,
);

export default router;
