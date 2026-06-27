import type { Request, Response } from "express";

import { login } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function httpLogin(req: Request, res: Response) {
  const user = await login();
  return sendSuccess(res, { data: user });
}
