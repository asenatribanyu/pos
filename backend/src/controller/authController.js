import models from "../model/index.js";
import logger from "../log/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { createAuditLog } from "../helper/auditLogHelper.js";

const login = async (req, res) => {
  try {
    const User = models.User;
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid password for user with email: ${email}`);
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Invalid credentials: email or password is incorrect",
        },
      });
    }
    const updateLastLogin = await User.update(
      { lastLoginAt: new Date() },
      { where: { id: user.id } },
    );
    const updatedUser = await User.findByPk(user.id, {
      attributes: {
        exclude: ["id", "password"],
      },
      include: [
        {
          model: models.Role,
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
          include: {
            model: models.Permission,
            through: { attributes: [] },
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
        },
        {
          model: models.Branch,
        },
      ],
    });
    const token = jwt.sign(
      { id: updatedUser.id, user: updatedUser },
      config.app.jwtSecret,
      {
        expiresIn: config.app.jwtExpiration,
      },
    );
    await createAuditLog(
      user.id,
      "Login",
      "Login",
      user.id,
      "User logged in successfully",
    );
    logger.info(`User logged in successfully with id: ${user.id}`);
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User logged in successfully",
      },
      data: {
        user: updatedUser,
        token,
      },
    });
  } catch (error) {
    logger.error(`Error in authController login: ${error.message}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { login };
