import { Request, Response } from "express";
import { UserModel } from "../models/userModel";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userID = (req as Request & { userID?: string }).userID;

    console.log("USERID IN CONTROLLER:", userID);

    if (!userID) {
      res.status(401).json({ message: "Missing userID from token" });
      return;
    }

    const user = await UserModel.findById(userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.log("CONTROLLER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
