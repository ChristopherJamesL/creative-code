import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "./auth.js";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { userRole } = req as AuthenticatedRequest;

    if (!roles.includes(userRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
