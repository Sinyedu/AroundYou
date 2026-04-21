import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUser } from "../types/auth";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
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

    req.user = decoded as JwtUser;

    console.log("✔ USER SET:", req.user);

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}
