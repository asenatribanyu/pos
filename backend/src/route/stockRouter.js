import { Router } from "express";
import stockController from "../controller/stockController.js";
import stockMiddleware from "../middleware/stockMiddleware.js";

const router = Router();

router.get("/", stockMiddleware.index, stockController.index);
router.post(
  "/",
  stockMiddleware.addNewProductStock,
  stockController.addNewProductStock,
);
router.put(
  "/",
  stockMiddleware.productStockAdjustment,
  stockController.productStockAdjustment,
);

export default router;
