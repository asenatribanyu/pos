import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv7(),
      },
      branchId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      // username: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   unique: true,
      // },
      // phone: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   unique: true,
      // },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    },
  );
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId" });
    User.hasMany(models.AuditLog, { foreignKey: "userId" });
    User.belongsTo(models.Branch, { foreignKey: "branchId" });
    User.hasMany(models.Transaction, { foreignKey: "userId" });
    User.hasMany(models.StockMovement, { foreignKey: "userId" });
  };

  return User;
};
