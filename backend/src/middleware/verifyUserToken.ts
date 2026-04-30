import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUser } from "../types/auth";
import { UserModel } from "../models/userModel";
import {
  getEffectivePermissions,
  normalizePermissions,
  normalizeRole,
} from "../utils/accessControl";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

    if (typeof decoded === "string") {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    const payload = decoded as JwtUser;
    const user = await UserModel.findById(payload.userID).select(
      "userName email firstName lastName role permissions isRestricted",
    );

    if (!user || user.isRestricted) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const role = normalizeRole(user.role);
    const permissions = getEffectivePermissions(
      role,
      normalizePermissions(user.permissions),
    );

    req.user = {
      userID: payload.userID,
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
      permissions,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
