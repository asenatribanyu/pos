import { ProductStock, Product, StockMovement, db } from "../model/index.js";
import logger from "../log/logger.js";
import {
  applyStockChange,
  adjustStockFromOpname,
} from "../services/productStockService.js";

const index = async (req, res) => {
  try {
    const { branchId } = req.query;

    const stocks = await ProductStock.findAll({
      where: { branchId },
      include: [{ model: Product }],
      order: [["productId", "ASC"]],
    });

    return res.status(200).json({
      meta: { code: 200, message: "Product stock fetched" },
      data: stocks,
    });
  } catch (error) {
    logger.error(`Error getting product stock: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

const addNewProductStock = async (req, res) => {
  const t = await db.transaction();
  try {
    const { branchId, productId, quantity } = req.body;

    await applyStockChange({
      productId,
      branchId,
      quantity,
      type: "in",
      referenceType: "opening",
      transaction: t,
    });

    await t.commit();
    logger.info(`User with id: ${req.user.id} added new product stock`);
    return res.status(200).json({
      meta: { code: 200, message: "Product stock added successfully" },
    });
  } catch (error) {
    await t.rollback();
    logger.error(`Error adding new product stock: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

const productStockAdjustment = async (req, res) => {
  const t = await db.transaction();
  try {
    const { branchId, productId, quantity } = req.body;

    await adjustStockFromOpname({
      productId,
      branchId,
      physicalQty: quantity,
      transaction: t,
    });

    await t.commit();
    logger.info(`User with id: ${req.user.id} adjusted product stock`);
    return res.status(200).json({
      meta: { code: 200, message: "Product stock adjusted successfully" },
    });
  } catch (error) {
    logger.error(`Error adjusting product stock: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

export default {
  index,
  addNewProductStock,
  productStockAdjustment,
};
