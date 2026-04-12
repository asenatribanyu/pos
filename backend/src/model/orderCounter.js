import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const OrderCounter = sequelize.define(
    "OrderCounter",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv7(),
      },
      branchId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastCounter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "order_counters",
      timestamps: true,
      underscored: true,
    },
  );
  OrderCounter.associate = (models) => {
    OrderCounter.belongsTo(models.Branch, { foreignKey: "branchId" });
  };
  return OrderCounter;
};
