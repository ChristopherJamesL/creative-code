import type { Request, Response } from "express";
import { listUsers, inviteUser, updateUserRole } from "./admin.service.js";
import { sendSuccess } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function httpListUsers(_req: Request, res: Response) {
  const users = await listUsers();
  return sendSuccess(res, { data: users });
}

export async function httpInviteUser(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { email, full_name = "" } = req.body as { email?: string; full_name?: string };

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await inviteUser(email, full_name, userId);
    return sendSuccess(res, { data: user, status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to invite user";
    console.error("[inviteUser]", message);
    res.status(400).json({ error: message });
  }
}

export async function httpUpdateUserRole(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { role } = req.body as { role?: string };

  const validRoles = ["admin", "attorney", "staff"];
  if (!role || !validRoles.includes(role)) {
    res.status(400).json({ error: `role must be one of: ${validRoles.join(", ")}` });
    return;
  }

  const updated = await updateUserRole(id, role);
  return sendSuccess(res, { data: updated });
}
