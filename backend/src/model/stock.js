import { DataTypes } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default (sequelize) => {
  const Stock = sequelize.define(
    "Stock",
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "stocks",
      timestamps: true,
      underscored: true,
    },
  );
  Stock.asscoiate = (models) => {
    Stock.belongsTo(models.Product, { foreignKey: "productId" });
  };
  return Stock;
};
