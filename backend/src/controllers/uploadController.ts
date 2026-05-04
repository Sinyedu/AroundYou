import { Request, Response } from "express";
import type { FileFilterCallback } from "multer";
import multer from "multer";

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only PNG and JPEG images are allowed"));
      return;
    }

    callback(null, true);
  },
});

export const uploadSingleImage = imageUpload.single("image");

export function uploadImage(req: Request, res: Response): void {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    res.status(400).json({ message: "No image file uploaded" });
    return;
  }

  // Store image directly in MongoDB-friendly string format (data URL), not on local disk.
  const base64 = uploadedFile.buffer.toString("base64");
  const imageUrl = `data:${uploadedFile.mimetype};base64,${base64}`;

  res.status(201).json({ imageUrl });
}
