import { Schema, model } from "mongoose";
import { Attraction } from "../interfaces/attraction";
// Define the Attraction schema
const attractionSchema = new Schema<Attraction>({
  name: { type: String, required: true, min: 3, max: 255 },
  description: { type: String, required: true, min: 3, max: 1024 },
  heroImage: { type: String, required: true },
  imageArray: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  link: { type: String, required: true },
  gpsPosition: { type: String, required: true },
  slugArray: { type: [String], default: [] },
  updateAt: { type: Date, default: Date.now },
  openingHours: { type: [String], default: [] },
  isHidden: { type: Boolean, default: false, index: true },
  hiddenAt: { type: Date },
  hiddenBy: { type: String },
});

export const AttractionModel = model<Attraction>(
  "Attraction",
  attractionSchema,
);
