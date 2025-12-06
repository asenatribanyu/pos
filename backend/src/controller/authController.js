import { User, Role, Company } from "../model/index.js";
import logger from "../log/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const register = async (req, res) => {
  try {
    const { name, email, companyName, companyAdress, companyPhone, password } = req.body;
    const role = await Role.findOne({
      where: {
        name: "Owner",
      },
    });
    const company = await Company.create({
      name: companyName,
      address: companyAdress,
      phone: companyPhone,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      companyId: company.id,
      password: hashedPassword,
      roleId: role.id,
    });

    const token = jwt.sign({ id: user.id }, config.app.jwtSecret, {
      expiresIn: config.app.jwtExpiration,
    });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    logger.info(`User created successfully with id: ${user.id}`);
    return res.status(201).json({
      meta: {
        code: 201,
        message: "User created successfully",
      },
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    logger.error(`Error in authController register: ${error.message}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

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
          message: "Invalid password",
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

export default { register, login };
