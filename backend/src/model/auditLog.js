import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv7(),
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      entityId: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      summary: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: true,
      underscored: true,
    },
  );
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: "userId" });
  };
  return AuditLog;
};
