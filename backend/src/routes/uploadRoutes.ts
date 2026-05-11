import { Router } from "express";
import {
  getUploadedImage,
  uploadImage,
  uploadSingleImage,
} from "../controllers/uploadController";
import { uploadRateLimiter } from "../middleware/rateLimit";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post("/upload/image", verifyToken, uploadRateLimiter, uploadSingleImage, uploadImage);
router.get("/images/:id", getUploadedImage);

export default router;
