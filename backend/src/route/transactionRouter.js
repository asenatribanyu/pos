import { Router } from "express";
import transactionController from "../controller/transactionController.js";
import transactionMiddleware from "../middleware/transactionMiddleware.js";

const router = Router();

router.post("/sell", transactionMiddleware.sell, transactionController.sell);
router.post(
  "/cancel-sale/:id",
  transactionMiddleware.cancelSale,
  transactionController.cancelSale,
);

export default router;
