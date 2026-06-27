import { Router } from "express";

import { httpLogin } from "./auth.controller.js";

const authRouter = Router();

authRouter.get("/login", httpLogin);

export default authRouter;
