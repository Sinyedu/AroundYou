import { Request, Response } from "express";
import { UserModel } from "../models/userModel";

export async function getCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  console.log("FINAL USER:", req.user);

  const userID = req.user?.userID;

  if (!userID) {
    console.log("❌ NO USERID");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await UserModel.findById(userID).select("-password");

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
}
