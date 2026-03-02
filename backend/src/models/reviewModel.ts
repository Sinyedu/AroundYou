import { Schema, model } from "mongoose";
import { Review } from "../interfaces/review";

const reviewSchema = new Schema<Review>({
  reviewID: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  title: { type: String, required: true, min: 6, max: 255 },
  description: { type: String, required: true, min: 6, max: 1024 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  likes: { type: Number, default: 0 },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const ReviewModel = model<Review>("Review", reviewSchema);
