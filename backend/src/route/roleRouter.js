import { Router } from "express";
import roleController from "../controller/roleController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", roleMiddleware.index, roleController.index);
router.post("/", roleMiddleware.create, roleController.create);
router.get("/:id", roleMiddleware.show, roleController.show);
router.put("/:id", roleMiddleware.update, roleController.update);
router.delete("/:id", roleMiddleware.destroy, roleController.destroy);

export default router;
