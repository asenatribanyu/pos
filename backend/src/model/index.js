import db from "../database/database.js";
import User from "./user.js";
import Role from "./role.js";
import Branch from "./branch.js";
import Permission from "./permission.js";
import RolePermission from "./rolePermission.js";

User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

User.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(User, { foreignKey: "branchId" });

export { db, User, Branch, Role, Permission, RolePermission };
