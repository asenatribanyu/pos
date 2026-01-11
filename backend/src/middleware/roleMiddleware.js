import Joi from "joi";
import logger from "../log/logger.js";
import authMiddleware from "./authMiddleware.js";

export const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "role.index");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    } else {
      next();
    }
  } catch (error) {
    logger.error(`Error getting roles: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "role.create");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    } else {
      const schema = Joi.object({
        name: Joi.string().required(),
        permissionIds: Joi.array().items(Joi.number()).required(),
        level: Joi.number().required(),
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
    }
  } catch (error) {
    logger.error(`Error creating role: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "role.show");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    } else {
      next();
    }
  } catch (error) {
    logger.error(`Error getting role: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "role.update");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    } else {
      const schema = Joi.object({
        name: Joi.string().required(),
        permissionIds: Joi.array().items(Joi.number()).required(),
        level: Joi.number().required(),
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
    }
  } catch (error) {
    logger.error(`Error updating role: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "role.destroy");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    } else {
      next();
    }
  } catch (error) {
    logger.error(`Error deleting role: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
