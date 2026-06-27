import type { Response } from "express";
import type { SendSuccessParams } from "../types/response.types.js";

export function sendSuccess<T>(
  res: Response,
  { data = null, status = 200 }: SendSuccessParams<T>,
) {
  return res.status(status).json({ success: true, data });
}
