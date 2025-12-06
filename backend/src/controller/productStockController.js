import { ProductStock, StockMovement } from "../model/index.js";
import logger from "../log/logger.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let whereClause = {};
    if (req.user.role.level == "developer") {
      logger.info(`Developer access product stock list by userId: ${req.user.id}`);
      whereClause = {};
    } else if (req.user.role.level == "company") {
      whereClause = { companyId: req.user.companyId };
    } else if (req.user.role.level == "branch") {
      whereClause = { branchId: req.user.branchId };
    }
    const { rows: productStocks, count } = await ProductStock.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product stocks fetched successfully",
      },
      data: productStocks,
    });
  } catch (error) {
    logger.error(`Error getting product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const addStock = async (req, res) => {
  try {
    const { productId, branchId, stock } = req.body;
    const productStock = await ProductStock.findOne({
      where: { productId, branchId },
    });
    if (productStock) {
      await StockMovement.create({ productId, branchId, userId: req.user.id, type: "IN", stock });
      await productStock.update({ stock: productStock.stock + stock });
      return res.status(200).json({
        meta: {
          code: 200,
          message: "Product stock updated successfully",
        },
        data: productStock,
      });
    }
    const newProductStock = await ProductStock.create({ productId, branchId, stock });
    await StockMovement.create({ productId, branchId, userId: req.user.id, type: "IN", stock });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product stock created successfully",
      },
      data: newProductStock,
    });
  } catch (error) {
    logger.error(`Error creating product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const productStock = await ProductStock.findOne({ where: { id } });
    if (!productStock) {
      logger.warn(`Product stock not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product stock not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product stock fetched successfully",
      },
      data: productStock,
    });
  } catch (error) {
    logger.error(`Error getting product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const productStock = await ProductStock.findOne({ where: { id } });
    if (!productStock) {
      logger.warn(`Product stock not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product stock not found",
        },
      });
    }
    await productStock.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product stock deleted successfully",
      },
    });
  } catch (error) {
    logger.error(`Error deleting product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, addStock, show, destroy };
