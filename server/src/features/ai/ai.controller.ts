import type { Request, Response } from "express";

import { scan } from "./ai.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function httpScan(req: Request, res: Response) {
  const response = await scan();
  return sendSuccess(res, { data: response });
}
