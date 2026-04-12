import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv7(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "permissions",
      timestamps: true,
      underscored: true,
    },
  );
  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, { through: "RolePermission" });
  };
  return Permission;
};
