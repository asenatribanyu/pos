import db from "../database/database.js";
import User from "./user.js";
import Role from "./role.js";
import Branch from "./branch.js";
import Permission from "./permission.js";
import RolePermission from "./rolePermission.js";
import Product from "./product.js";
import ProoductCategory from "./productCategory.js";
import ProductStock from "./productStock.js";
import StockMovement from "./stockMovement.js";

User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

User.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(User, { foreignKey: "branchId" });

Product.belongsTo(ProoductCategory, { foreignKey: "categoryId" });
ProoductCategory.hasMany(Product, { foreignKey: "categoryId" });

ProductStock.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(ProductStock, { foreignKey: "productId" });

ProductStock.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(ProductStock, { foreignKey: "branchId" });

StockMovement.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(StockMovement, { foreignKey: "productId" });

StockMovement.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(StockMovement, { foreignKey: "branchId" });

export { db, User, Branch, Role, Permission, RolePermission, Product, ProoductCategory, ProductStock, StockMovement };
