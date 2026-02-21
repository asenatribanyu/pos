import authMiddleware from "./authMiddleware.js";
import logger from "../log/logger.js";
import Joi from "joi";

const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "product.index");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error getting products: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const create = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "product.create");
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
      categoryId: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().allow(null, "").optional(),
      type: Joi.string().valid("retail", "service", "fnb").required(),
      price: Joi.number().required(),
      costPrice: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn(`Invalid request body: ${error.message}`);
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error creating product: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const show = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "product.show");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error getting product: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const update = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "product.update");
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
      categoryId: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().allow(null, "").optional(),
      type: Joi.string().valid("retail", "service", "fnb").required(),
      price: Joi.number().required(),
      costPrice: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn(`Invalid request body: ${error.message}`);
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error updating product: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const destroy = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "product.destroy",
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
    next();
  } catch (error) {
    logger.error(`Error deleting product: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
