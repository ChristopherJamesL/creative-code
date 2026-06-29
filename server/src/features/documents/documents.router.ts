import { Router } from "express";
import multer from "multer";
import { httpGetAllDocuments, httpCreateDocument, httpGetDocument, httpSearchDocuments, httpGetFileUrl, httpStreamDocument, httpDeleteDocument } from "./documents.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const documentsRouter = Router();

documentsRouter.use(requireAuth);

documentsRouter.get("/", httpGetAllDocuments);
documentsRouter.get("/search", httpSearchDocuments);
documentsRouter.post("/", upload.single("file"), httpCreateDocument);
documentsRouter.get("/:id", httpGetDocument);
documentsRouter.get("/:id/file", httpStreamDocument);
documentsRouter.get("/:id/file-url", httpGetFileUrl);
documentsRouter.delete("/:id", requireAdmin, httpDeleteDocument);

export default documentsRouter;
