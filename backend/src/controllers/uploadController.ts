import { Request, Response } from "express";
import type { FileFilterCallback } from "multer";
import multer from "multer";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "";
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowedMimeTypes = new Set([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]);
    const allowedExtensions = new Set(["png", "jpg", "jpeg", "webp"]);

    if (
      !allowedMimeTypes.has(file.mimetype) ||
      !allowedExtensions.has(getFileExtension(file.originalname))
    ) {
      callback(new Error("Kun PNG-, JPG- og WEBP-billeder er tilladt"));
      return;
    }

    callback(null, true);
  },
});

export const uploadSingleImage = imageUpload.single("image");

const getImagesBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB database is not connected");
  }

  return new GridFSBucket(mongoose.connection.db, { bucketName: "images" });
};

const saveImageToDatabase = async (file: Express.Multer.File) => {
  const bucket = getImagesBucket();
  const extension = getFileExtension(file.originalname);
  const fileName = `${Date.now()}-${new ObjectId().toString()}.${extension}`;

  return new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileName, {
      metadata: {
        contentType: file.mimetype,
        originalName: file.originalname,
        uploadedAt: new Date(),
      },
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id as ObjectId));
    uploadStream.end(file.buffer);
  });
};

export async function uploadImage(req: Request, res: Response): Promise<void> {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    res.status(400).json({ message: "Der blev ikke uploadet noget billede" });
    return;
  }

  try {
    const imageId = await saveImageToDatabase(uploadedFile);
    const imageUrl = `${req.protocol}://${req.get("host")}/api/images/${imageId.toString()}`;

    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ message: "Billedet kunne ikke uploades" });
  }
}

export async function getUploadedImage(
  req: Request,
  res: Response,
): Promise<void> {
  const imageIdParam = req.params.id;

  if (!imageIdParam || Array.isArray(imageIdParam) || !ObjectId.isValid(imageIdParam)) {
    res.status(400).json({ message: "Billedet har et ugyldigt id" });
    return;
  }

  try {
    const bucket = getImagesBucket();
    const imageId = new ObjectId(imageIdParam);
    const imageFile = await bucket.find({ _id: imageId }).next();

    if (!imageFile) {
      res.status(404).json({ message: "Billedet blev ikke fundet" });
      return;
    }

    const metadata = imageFile.metadata as
      | { contentType?: string }
      | undefined;

    if (metadata?.contentType) {
      res.setHeader("Content-Type", metadata.contentType);
    }

    bucket.openDownloadStream(imageId).pipe(res);
  } catch (error) {
    console.error("Get uploaded image error:", error);
    res.status(500).json({ message: "Billedet kunne ikke indlæses" });
  }
}
