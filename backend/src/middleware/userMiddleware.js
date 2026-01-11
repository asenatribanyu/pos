import Joi from "joi";
import logger from "../log/logger.js";
import authMiddleware from "./authMiddleware.js";

export const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "user.index");
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
    logger.error(`Error getting users: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "user.create");
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
        email: Joi.string().required(),
        password: Joi.string().required(),
        roleId: Joi.number().required(),
        branchId: Joi.number().allow(null).optional(),
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
    logger.error(`Error creating user: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "user.update");
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
        email: Joi.string().required(),
        password: Joi.string().required(),
        roleId: Joi.number().required(),
        branchId: Joi.number().allow(null).optional(),
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
    logger.error(`Error updating user: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "user.show");
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
    logger.error(`Error getting user: ${error}`);
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
    const granted = await authMiddleware.checkPermission(req, "user.destroy");
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
    logger.error(`Error deleting user: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const profile = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    logger.error(`Error getting profile: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
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
    logger.error(`Error changing password: ${error}`);
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
  profile,
  changePassword,
};
