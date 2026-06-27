import { Router } from "express";

import { httpGetAllDocuments } from "./documents.controller.js";

const documentsRouter = Router();

documentsRouter.get("/", httpGetAllDocuments);

export default documentsRouter;
