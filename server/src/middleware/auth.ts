import type { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase.js";

export interface AuthenticatedRequest extends Request {
  userId: string;
  userEmail: string;
  userRole: string;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }

  // Fetch role from profiles in the same middleware so requireRole is free
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const authed = req as AuthenticatedRequest;
  authed.userId    = user.id;
  authed.userEmail = user.email ?? "";
  authed.userRole  = profile?.role ?? "staff";

  next();
}
