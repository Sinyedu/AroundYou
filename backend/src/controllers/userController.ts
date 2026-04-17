import { Request, Response } from "express";
import { UserModel } from "../models/userModel";

export const getCurrentUser = async (req: Request, res: Response) => {
  const userID = (req as Request & { userID?: string }).userID;

  if (!userID) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await UserModel.findById(userID).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
};
