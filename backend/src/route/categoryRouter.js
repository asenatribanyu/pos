import { Router } from "express";
import categoryController from "../controller/categoryController.js";
import categoryMiddleware from "../middleware/categoryMiddleware.js";

const router = Router();

router.get("/", categoryMiddleware.index, categoryController.index);
router.post("/", categoryMiddleware.create, categoryController.create);
router.get("/:id", categoryMiddleware.show, categoryController.show);
router.put("/:id", categoryMiddleware.update, categoryController.update);
router.delete("/:id", categoryMiddleware.destroy, categoryController.destroy);

export default router;
