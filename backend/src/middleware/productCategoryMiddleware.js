import authMiddleware from "./authMiddleware.js";
import logger from "../log/logger.js";
import Joi from "joi";

const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "product.category.index",
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
    logger.error(`Error getting product category: ${error}`);
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
    const granted = await authMiddleware.checkPermission(
      req,
      "product.category.create",
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
      name: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    next();
  } catch (error) {
    logger.error(`Error create product category in Middleware: ${error}`);
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
    const granted = await authMiddleware.checkPermission(
      req,
      "product.category.show",
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
    logger.error(`Error show product category: ${error}`);
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
    const granted = await authMiddleware.checkPermission(
      req,
      "product.category.update",
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
      name: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    next();
  } catch (error) {
    logger.error(`Error update product category: ${error}`);
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
      "product.category.destroy",
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
    logger.error(`Error delete product category: ${error}`);
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
  create,
  show,
  update,
  destroy,
};
