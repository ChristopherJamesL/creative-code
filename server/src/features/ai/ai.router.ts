import { Router } from "express";

import { httpScan } from "./ai.controller.js";

const aiRouter = Router();

aiRouter.get("/scan", httpScan);

export default aiRouter;
