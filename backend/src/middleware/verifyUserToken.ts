import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userID: string;
}

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    console.log("DECODED:", decoded);

    (req as Request & { userID?: string }).userID = decoded.userID;

    console.log("ATTACHED USERID:", (req as any).userID);

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}
