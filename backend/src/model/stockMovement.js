import db from "../database/database.js";
import { DataTypes } from "sequelize";

const StockMovement = db.define(
    "StockMovement",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        branchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type:{
            type: DataTypes.ENUM('in', 'out', 'adjust'),
            allowNull: false,
        },
        referenceType:{
            type: DataTypes.ENUM('sale', 'opname', 'purchase'),
            allowNull: false,
        },
        referenceId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        underscored: true,
    }
);

export default StockMovement;