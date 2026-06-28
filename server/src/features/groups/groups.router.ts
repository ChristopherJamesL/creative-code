import { Router } from "express";
import { httpListGroups, httpCreateGroup } from "./groups.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const groupsRouter = Router();

groupsRouter.use(requireAuth);

groupsRouter.get("/", httpListGroups);
groupsRouter.post("/", httpCreateGroup);

export default groupsRouter;
