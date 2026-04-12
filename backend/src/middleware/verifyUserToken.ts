import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify the JWT token and protect routes
 * @param req
 * @param res
 * @param next
 */

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.header("auth-token");
  if (!token) {
    res.status(400).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    if (token) jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token." });
  }
}
