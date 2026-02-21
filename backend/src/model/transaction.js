import db from "../database/database.js";
import { DataTypes } from "sequelize";

const Transaction = db.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "debit", "transfer", "qris"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "void"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default Transaction;
