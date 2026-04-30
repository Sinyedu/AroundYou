import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { getEffectivePermissions } from "../utils/accessControl";

export async function getCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userID = req.user?.userID;

  if (!userID) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await UserModel.findById(userID).select(
    "userName email firstName lastName userAvatar role permissions",
  );

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    userName: user.userName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userAvatar: user.userAvatar,
    role: user.role,
    permissions: getEffectivePermissions(user.role, user.permissions),
  });
}
