import { Request } from "express";

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
  role?: "user" | "admin";
}
