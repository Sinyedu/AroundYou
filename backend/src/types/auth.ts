import { Request } from "express";

export interface JwtPayload {
  userID: string;
}

export interface AuthRequest extends Request {
  userID: string;
}
