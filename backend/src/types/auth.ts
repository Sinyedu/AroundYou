import { Request } from "express";
import { UserPermission, UserRole } from "../constants/enums";

export interface JwtPayload {
  userID: string;
}

export interface AuthRequest extends Request {
  userID: string;
}

export interface JwtUser {
  userID: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions: UserPermission[];
}
