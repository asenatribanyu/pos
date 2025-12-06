import db from "../database/database.js";
import User from "./user.js";
import Role from "./role.js";
import Company from "./company.js";
import Branch from "./branch.js";
import Permission from "./permission.js";
import RolePermission from "./rolePermission.js";
import ProductCategory from "./productCategory.js";
import Product from "./product.js";
import ProductStock from "./productStock.js";

User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

User.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(User, { foreignKey: "companyId" });

User.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(User, { foreignKey: "branchId" });

Branch.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Branch, { foreignKey: "companyId" });

ProductCategory.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(ProductCategory, { foreignKey: "companyId" });

Product.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Product, { foreignKey: "companyId" });

ProductStock.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(ProductStock, { foreignKey: "branchId" });

ProductCategory.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(ProductCategory, { foreignKey: "categoryId" });

Product.hasMany(ProductStock, { foreignKey: "productId" });
ProductStock.belongsTo(Product, { foreignKey: "productId" });

export { db, User, Company, Branch, Role, Permission, RolePermission };
