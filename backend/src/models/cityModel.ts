import { Schema, model } from "mongoose";
import { City } from "../interfaces/city";

const citySchema = new Schema<City>({
  name: { type: String, required: true, min: 3, max: 255 },
  description: { type: String, required: true, min: 3, max: 1024 },
  heroImage: { type: String, required: true },
  commune: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true },
  gpsPosition: { type: String, required: true },
  population: { type: Number, required: true, min: 0 },
  visitorCenter: { type: String, required: false },
  isHidden: { type: Boolean, default: false, index: true },
  hiddenAt: { type: Date },
  hiddenBy: { type: String },
});

export const CityModel = model<City>("City", citySchema);
