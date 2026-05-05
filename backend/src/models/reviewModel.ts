import { Schema, model } from "mongoose";
import { Review } from "../interfaces/review";

const reviewSchema = new Schema<Review>({
  targetId: { type: String, required: true, index: true },
  targetType: { type: String, enum: ['city', 'event', 'attraction'], required: true },
  author: { type: String, required: true },
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  description: { type: String, required: true, minlength: 6, maxlength: 1024 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  edited: { type: Boolean, default: false },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  reportCount: { type: Number, default: 0, min: 0 },
  reports: {
    type: [
      {
        reportedBy: { type: String, required: true },
        reason: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  reportResolved: { type: Boolean, default: false },
  reportResolvedAt: { type: Date },
  reportResolvedBy: { type: String },
  isHidden: { type: Boolean, default: false, index: true },
  hiddenAt: { type: Date },
  hiddenBy: { type: String },
});

export const ReviewModel = model<Review>("Review", reviewSchema);
