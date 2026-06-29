import { Router } from "express";
import { httpLogin, httpLogout, httpGetMe, httpExchangeToken, httpSetPassword } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login",          httpLogin);
authRouter.post("/logout",         httpLogout);
authRouter.post("/exchange-token", httpExchangeToken);
authRouter.post("/set-password",   httpSetPassword);
authRouter.get("/me",              requireAuth, httpGetMe);

export default authRouter;
