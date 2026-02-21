import Joi from "joi";
import logger from "../log/logger.js";
import authMiddleware from "./authMiddleware.js";

const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "product.stock.index",
    );
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: { code: 401, message: "You Don't Have Permission" },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error getting product stock: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

const addNewProductStock = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "product.stock.new",
    );
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    }
    const schema = Joi.object({
      branchId: Joi.number().required(),
      productId: Joi.number().required(),
      quantity: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn(
        `Invalid request body in create product stock: ${error.message}`,
      );
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error create product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const productStockAdjustment = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "product.stock.adjustment",
    );
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    }
    const schema = Joi.object({
      branchId: Joi.number().required(),
      productId: Joi.number().required(),
      quantity: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn(
        `Invalid request body in product stock adjustment: ${error.message}`,
      );
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error adjusting product stock: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default {
  index,
  addNewProductStock,
  productStockAdjustment,
};
