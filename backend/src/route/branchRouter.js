import { Router } from "express";
import branchController from "../controller/branchController.js";
import branchMiddleware from "../middleware/branchMiddleware.js";

const router = Router();

router.get("/", branchMiddleware.index, branchController.index);
router.post("/", branchMiddleware.create, branchController.create);
router.get("/:id", branchMiddleware.show, branchController.show);
router.put("/:id", branchMiddleware.update, branchController.update);
router.delete("/:id", branchMiddleware.destroy, branchController.destroy);

export default router;
