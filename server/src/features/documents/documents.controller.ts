import type { Request, Response } from "express";

import { getAllDocuments } from "./documents.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function httpGetAllDocuments(req: Request, res: Response) {
  const documents = await getAllDocuments();
  return sendSuccess(res, { data: documents });
}
