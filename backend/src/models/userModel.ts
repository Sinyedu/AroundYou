import { Schema, model } from "mongoose";
import { User } from "../interfaces/user.js";

const userSchema = new Schema<User>({
  userID: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, min: 2, max: 255 },
  lastName: { type: String, required: true, min: 2, max: 255 },
  userName: { type: String, required: true, min: 3, max: 255, unique: true },
  userAvatar: { type: String, default: "" },
  email: { type: String, required: true, min: 6, max: 255, unique: true },
  password: { type: String, required: true, min: 6, max: 255 },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  streetNumber: { type: String, required: true },
  postalCode: { type: String, required: true },
  isRestricted: { type: Boolean, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const UserModel = model<User>("User", userSchema);
