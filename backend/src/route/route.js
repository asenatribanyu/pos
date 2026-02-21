import { Router } from "express";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import permissionController from "../controller/permissionController.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";
import roleController from "../controller/roleController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import branchController from "../controller/branchController.js";
import branchMiddleware from "../middleware/branchMiddleware.js";
import userMiddleware from "../middleware/userMiddleware.js";
import userController from "../controller/userController.js";
import productCategoryController from "../controller/productCategoryController.js";
import productCategoryMiddleware from "../middleware/productCategoryMiddleware.js";
import productController from "../controller/productController.js";
import productMiddleware from "../middleware/productMiddleware.js";
import productStockController from "../controller/productStockController.js";
import productStockMiddleware from "../middleware/productStockMiddleware.js";
import transactionController from "../controller/transactionController.js";
import transactionMiddleware from "../middleware/transactionMiddleware.js";
``;

const router = Router();

router.use((req, res, next) => {
  if (req.path === "/auth/login" || req.path === "/auth/register") {
    return next();
  }
  return authMiddleware.validateToken(req, res, next);
});

router.post("/auth/login", authMiddleware.login, authController.login);

router.get(
  "/permission",
  permissionMiddleware.index,
  permissionController.index,
);
router.post(
  "/permission",
  permissionMiddleware.create,
  permissionController.create,
);
router.get(
  "/permission/:id",
  permissionMiddleware.show,
  permissionController.show,
);
router.put(
  "/permission/:id",
  permissionMiddleware.update,
  permissionController.update,
);
router.delete(
  "/permission/:id",
  permissionMiddleware.destroy,
  permissionController.destroy,
);

router.get("/role", roleMiddleware.index, roleController.index);
router.post("/role", roleMiddleware.create, roleController.create);
router.get("/role/:id", roleMiddleware.show, roleController.show);
router.put("/role/:id", roleMiddleware.update, roleController.update);
router.delete("/role/:id", roleMiddleware.destroy, roleController.destroy);

router.get("/branch", branchMiddleware.index, branchController.index);
router.post("/branch", branchMiddleware.create, branchController.create);
router.get("/branch/:id", branchMiddleware.show, branchController.show);
router.put("/branch/:id", branchMiddleware.update, branchController.update);
router.delete(
  "/branch/:id",
  branchMiddleware.destroy,
  branchController.destroy,
);

router.get("/user", userMiddleware.index, userController.index);
router.post("/user", userMiddleware.create, userController.create);
router.get("/user/:id", userMiddleware.show, userController.show);
router.put("/user/:id", userMiddleware.update, userController.update);
router.delete("/user/:id", userMiddleware.destroy, userController.destroy);

router.get(
  "/product-category",
  productCategoryMiddleware.index,
  productCategoryController.index,
);
router.post(
  "/product-category",
  productCategoryMiddleware.create,
  productCategoryController.create,
);
router.get(
  "/product-category/:id",
  productCategoryMiddleware.show,
  productCategoryController.show,
);
router.put(
  "/product-category/:id",
  productCategoryMiddleware.update,
  productCategoryController.update,
);
router.delete(
  "/product-category/:id",
  productCategoryMiddleware.destroy,
  productCategoryController.destroy,
);

router.get("/product", productMiddleware.index, productController.index);
router.post("/product", productMiddleware.create, productController.create);
router.get("/product/:id", productMiddleware.show, productController.show);
router.put("/product/:id", productMiddleware.update, productController.update);
router.delete(
  "/product/:id",
  productMiddleware.destroy,
  productController.destroy,
);

router.post(
  "/transaction",
  transactionMiddleware.sell,
  transactionController.sell,
);

router.get(
  "/product-stock",
  productStockMiddleware.index,
  productStockController.index,
);
router.post(
  "/product-stock/new",
  productStockMiddleware.addNewProductStock,
  productStockController.addNewProductStock,
);
router.post(
  "/product-stock/adjustment",
  productStockMiddleware.productStockAdjustment,
  productStockController.productStockAdjustment,
);

router.get("/me", userMiddleware.profile, userController.profile);
router.put(
  "/me/change-password",
  userMiddleware.changePassword,
  userController.changePassword,
);

export default router;
