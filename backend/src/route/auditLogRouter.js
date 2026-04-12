import { Router } from "express";
import auditLogController from "../controller/auditLogController.js";
import auditLogMiddleware from "../middleware/auditLogMiddleware.js";

const router = Router();

router.get("/", auditLogMiddleware.index, auditLogController.index);

export default router;
