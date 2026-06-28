import { Router } from "express";
import { httpLogin, httpLogout, httpGetMe, httpExchangeToken } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login",          httpLogin);
authRouter.post("/logout",         httpLogout);
authRouter.post("/exchange-token", httpExchangeToken);
authRouter.get("/me",              requireAuth, httpGetMe);

export default authRouter;
