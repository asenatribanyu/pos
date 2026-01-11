import { User, Role } from "../model/index.js";
import logger from "../log/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const login = async (req, res) => {
  try {
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
    const { password: _, ...userWithoutPassword } = user.toJSON();
    const token = jwt.sign({ id: user.id }, config.app.jwtSecret, {
      expiresIn: config.app.jwtExpiration,
    });
    logger.info(`User logged in successfully with id: ${user.id}`);
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User logged in successfully",
      },
      data: {
        user: userWithoutPassword,
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
