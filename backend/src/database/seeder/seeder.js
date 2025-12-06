import fs from "fs";
import logger from "../../log/logger.js";
import { db, Role, RolePermission, User, Permission } from "../../model/index.js";
import bcrypt from "bcrypt";

const roles = fs.readFileSync("src/database/seeder/role.json", "utf-8");
const permissions = fs.readFileSync("src/database/seeder/permission.json", "utf-8");

const seed = async () => {
  try {
    await db.sync({ force: true });
    const data = JSON.parse(roles);
    await Role.bulkCreate(data.roles);
    const roleAdmin = await Role.findOne({ where: { name: "Super Admin" } });
    const permissionsData = JSON.parse(permissions);
    for (const permission of permissionsData.permissions) {
      const createdPermission = await Permission.create({ name: permission.name });
      await RolePermission.create({ roleId: roleAdmin.id, permissionId: createdPermission.id });
    }
    const password = await bcrypt.hash("admin123", 10);
    const userAdmin = await User.create({
      name: "Super Admin",
      email: "asenatribanyu@gmail.com",
      roleId: roleAdmin.id,
      password,
    });
    await db.close();
    logger.info("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
  }
};

seed();
