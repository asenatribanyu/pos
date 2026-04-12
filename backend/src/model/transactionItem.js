import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const TransactionItem = sequelize.define(
    "TransactionItem",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv7(),
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "transaction_items",
      timestamps: true,
      underscored: true,
    },
  );
  TransactionItem.associate = (models) => {
    TransactionItem.belongsTo(models.Transaction, {
      foreignKey: "transactionId",
    });
    TransactionItem.belongsTo(models.Product, { foreignKey: "productId" });
  };
  return TransactionItem;
};
