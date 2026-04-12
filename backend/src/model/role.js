import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const Role = sequelize.define(
    "Role",
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
      level: {
        type: DataTypes.ENUM("0", "1", "2"),
        allowNull: false,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: true,
    },
  );
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleId" });
    Role.belongsToMany(models.Permission, {
      through: "RolePermission",
    });
  };
  return Role;
};
