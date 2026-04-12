import { Router } from "express";
import productController from "../controller/productController.js";
import productMiddleware from "../middleware/productMiddleware.js";

const router = Router();

router.get("/", productMiddleware.index, productController.index);
router.post("/", productMiddleware.create, productController.create);
router.get("/:id", productMiddleware.show, productController.show);
router.put("/:id", productMiddleware.update, productController.update);
router.delete("/:id", productMiddleware.destroy, productController.destroy);

export default router;
