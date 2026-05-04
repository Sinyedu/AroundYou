import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";
import { USER_PERMISSIONS, USER_ROLES } from "../constants/enums";

const userSchema = new Schema<User>({
  firstName: { type: String, required: true, min: 2, max: 255 },
  lastName: { type: String, required: true, min: 2, max: 255 },
  userName: { type: String, required: true, min: 3, max: 255, unique: true },
  userAvatar: { type: String, default: "" },
  email: { type: String, required: true, min: 6, max: 255, unique: true },
  password: { type: String, required: true, min: 6, max: 255 },
  role: { type: String, enum: USER_ROLES, default: "user", required: true },
  permissions: {
    type: [String],
    enum: USER_PERMISSIONS,
    default: [],
    required: true,
  },
  country: { type: String, required: false },
  city: { type: String, required: false },
  street: { type: String, required: false },
  streetNumber: { type: String, required: false },
  postalCode: { type: String, required: false },
  isRestricted: { type: Boolean, default: false },
  createdAt: { type: Date, required: false, default: Date.now },
});

export const UserModel = model<User>("User", userSchema);
