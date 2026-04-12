import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelieze) => {
  const StockMovement = sequelieze.define(
    "StockMovement",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv7(),
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      referenceId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      referenceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "stock_movements",
      timestamps: true,
      underscored: true,
    },
  );
  StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Product, { foreignKey: "productId" });
    StockMovement.belongsTo(models.User, { foreignKey: "userId" });
  };
  return StockMovement;
};
