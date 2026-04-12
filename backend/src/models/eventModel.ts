import { Schema, model } from "mongoose";
import { Event } from "../interfaces/event";

const eventSchema = new Schema<Event>({
  eventID: { type: String, required: true, unique: true },
  name: { type: String, required: true, min: 6, max: 255 },
  description: { type: String, required: true, min: 3, max: 1024 },
  heroImage: { type: String, required: true },
  imageArray: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  link: { type: String, required: true },
  gpsPosition: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  slugArray: { type: [String], default: [] },
  updateAt: { type: Date, default: Date.now },
  isAnnual: { type: Boolean, required: true, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  openingHours: { type: [String], default: [] },
});

export const EventModel = model<Event>("Event", eventSchema);
