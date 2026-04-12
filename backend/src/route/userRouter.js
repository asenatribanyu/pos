import { Router } from "express";
import userController from "../controller/userController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = Router();

router.get("/", userMiddleware.index, userController.index);
router.post("/", userMiddleware.create, userController.create);
router.get("/:id", userMiddleware.show, userController.show);
router.put("/:id", userMiddleware.update, userController.update);
router.delete("/:id", userMiddleware.destroy, userController.destroy);

export default router;
