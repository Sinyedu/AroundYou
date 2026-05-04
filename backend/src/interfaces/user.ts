import { Document } from "mongoose";
import { UserPermission, UserRole } from "../constants/enums";

export interface User extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  userAvatar: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: UserPermission[];

  country?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;

  isRestricted: boolean;
  createdAt: Date;
}
