import type { Request, Response } from "express";
import { listGroups, createGroup } from "./groups.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function httpListGroups(_req: Request, res: Response) {
  const groups = await listGroups();
  return sendSuccess(res, { data: groups });
}

export async function httpCreateGroup(req: Request, res: Response) {
  const { name } = req.body as { name?: string };

  if (!name?.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const group = await createGroup(name);
  return sendSuccess(res, { data: group, status: 201 });
}
