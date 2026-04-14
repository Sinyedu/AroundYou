import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
  userID: { type: String, required: false, unique: true },
  firstName: { type: String, required: true, min: 2, max: 255 },
  lastName: { type: String, required: true, min: 2, max: 255 },
  userName: { type: String, required: true, min: 3, max: 255, unique: true },
  userAvatar: { type: String, default: "" },
  email: { type: String, required: true, min: 6, max: 255, unique: true },
  password: { type: String, required: true, min: 6, max: 255 },
  country: { type: String, required: false },
  city: { type: String, required: false },
  street: { type: String, required: false },
  streetNumber: { type: String, required: false },
  postalCode: { type: String, required: false },
  isRestricted: { type: Boolean, default: false },
  createdAt: { type: Date, required: false, default: Date.now },
});

export const UserModel = model<User>("User", userSchema);
