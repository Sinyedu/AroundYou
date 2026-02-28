import { Schema, model } from "mongoose";
import { Attraction } from "../interfaces/attraction";

const attractionSchema = new Schema<Attraction>({
  attractionID: { type: String, required: true, unique: true },
  name: { type: String, required: true, min: 3, max: 255 },
  description: { type: String, required: true, min: 3, max: 1024 },
  heroImage: { type: String, required: true },
  imageArray: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  link: { type: String, required: true },
  gpsPosition: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  slugArray: { type: [String], default: [] },
  updateAt: { type: Date, default: Date.now },
  openingHours: { type: [String], default: [] },
});

export const AttractionModel = model<Attraction>(
  "Attraction",
  attractionSchema,
);
