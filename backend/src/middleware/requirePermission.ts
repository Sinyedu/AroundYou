import { NextFunction, Request, Response } from "express";
import { UserPermission } from "../constants/enums";

export function requirePermission(permission: UserPermission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const permissions = req.user?.permissions ?? [];

    if (!permissions.includes(permission)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
}
