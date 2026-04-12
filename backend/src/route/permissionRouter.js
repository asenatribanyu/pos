import { Router } from "express";
import permissionController from "../controller/permissionController.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";

const router = Router();

router.get("/", permissionMiddleware.index, permissionController.index);
router.post("/", permissionMiddleware.create, permissionController.create);
router.get("/:id", permissionMiddleware.show, permissionController.show);
router.put("/:id", permissionMiddleware.update, permissionController.update);
router.delete(
  "/:id",
  permissionMiddleware.destroy,
  permissionController.destroy,
);

export default router;
