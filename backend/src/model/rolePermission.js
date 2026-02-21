import { DataTypes } from "sequelize";
import db from "../database/database.js";

const RolePermission = db.define(
  "RolePermission",
  {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default RolePermission;
