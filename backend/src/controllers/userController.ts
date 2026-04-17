import { Request, Response } from "express";
import { UserModel } from "../models/userModel";

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: string }).userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
};
