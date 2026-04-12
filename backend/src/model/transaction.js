import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv7(),
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      branchId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "transactions",
      timestamps: true,
      underscored: true,
    },
  );
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Branch, { foreignKey: "branchId" });
    Transaction.belongsTo(models.User, { foreignKey: "userId" });
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: "transactionId",
    });
  };
  return Transaction;
};
