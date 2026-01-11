import joi from "joi";
import logger from "../log/logger.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User, Role, Permission, RolePermission } from "../model/index.js";

const login = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
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
    logger.error(`Error logging in user: ${error.message}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        meta: { code: 401, message: "Unauthorized" },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        meta: { code: 401, message: "Unauthorized" },
      });
    }

    const decoded = jwt.verify(token, config.app.jwtSecret);

    const user = await User.findOne({
      where: { id: decoded.id },
      include: {
        model: Role,
        include: { model: Permission, through: { attributes: [] } },
      },
    });

    if (!user) {
      return res.status(401).json({
        meta: { code: 401, message: "Unauthorized" },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Token expired",
        },
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Invalid token",
        },
      });
    }

    logger.error(`Error validating token: ${error.message}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

const checkPermission = async (req, permission) => {
  const user = req.user;
  const hasPermission = user.Role.Permissions.some((rp) => rp.name === permission);

  if (hasPermission) {
    return true;
  } else {
    return false;
  }
};

export default { login, validateToken, checkPermission };
