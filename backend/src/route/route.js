import { Router } from "express";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleRouter from "./roleRouter.js";
import permissionRouter from "./permissionRouter.js";
import branchRouter from "./branchRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import stockRouter from "./stockRouter.js";
import transactionRouter from "./transactionRouter.js";
import userRouter from "./userRouter.js";
import auditLogRouter from "./auditLogRouter.js";

const router = Router();

router.use((req, res, next) => {
  if (req.path === "/auth/login" || req.path === "/auth/register") {
    return next();
  }
  return authMiddleware.validateToken(req, res, next);
});

router.post("/auth/login", authMiddleware.login, authController.login);
router.use("/role", roleRouter);
router.use("/permission", permissionRouter);
router.use("/branch", branchRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/stock", stockRouter);
router.use("/transaction", transactionRouter);
router.use("/user", userRouter);
router.use("/audit-log", auditLogRouter);

export default router;
