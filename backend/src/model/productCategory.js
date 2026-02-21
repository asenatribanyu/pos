import db from "../database/database.js";
import { DataTypes } from "sequelize";

const ProductCategory = db.define(
  "ProductCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default ProductCategory;
