import { DataTypes } from "sequelize";
import db from "../database/database.js";

const Product = db.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("retail", "service", "fnb"),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    costPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default Product;
