import { Router } from "express";
import { httpListUsers, httpInviteUser, httpUpdateUserRole } from "./admin.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/users",             httpListUsers);
adminRouter.post("/users/invite",     httpInviteUser);
adminRouter.patch("/users/:id/role",  httpUpdateUserRole);

export default adminRouter;
