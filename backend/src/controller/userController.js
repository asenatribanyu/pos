import { User, Role, Branch } from "../model/index.js";
import { Op } from "sequelize";
import logger from "../log/logger.js";
import bcrypt from "bcrypt";

const index = async (req, res) => {
  try {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const level = req.user.Role.level;
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }, { "$Role.name$": { [Op.iLike]: `%${search}%` } }, { "$Branch.name$": { [Op.iLike]: `%${search}%` } }],
      };
    }
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
      where: whereClause,
      include: [
        {
          model: Role,
          where: {
            level: {
              [Op.gte]: level,
            },
          },
        },
        {
          model: Branch,
        },
      ],
      order: [["name", "ASC"]],
    });
    res.status(200).json({
      meta: {
        code: 200,
        message: "Users fetched successfully",
      },
      data: users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({
      meta: {
        code: 504,
        message: "Internal server error",
      },
    });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, password, roleId, branchId } = req.body;
    const level = req.user.Role.level;
    const role = await Role.findByPk(roleId);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "User already exists",
        },
      });
    }
    if (branchId) {
      const branch = await Branch.findByPk(branchId);
      if (!branch) {
        logger.warn(`Branch not found with id: ${branchId}`);
        return res.status(404).json({
          meta: {
            code: 404,
            message: "Branch not found",
          },
        });
      }
    }

    if (!role) {
      logger.warn(`Role not found with id: ${roleId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Role not found",
        },
      });
    }

    if (role.level < level) {
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden: You don't have permission to assign this role",
        },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, roleId, branchId });
    return res.status(201).json({
      meta: {
        code: 201,
        message: "User created successfully",
      },
      data: user,
    });
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

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role }, { model: Branch }],
    });
    if (!user) {
      logger.warn(`User not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User fetched successfully",
      },
      data: user,
    });
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleId, branchId } = req.body;
    const level = req.user.Role.level;
    const userId = req.user.id;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
        },
        {
          model: Branch,
        },
      ],
    });
    const role = await Role.findByPk(roleId);
    if (!user) {
      logger.warn(`User not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (!role) {
      logger.warn(`Role not found with id: ${roleId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Role not found",
        },
      });
    }
    if (user.Role.level < level) {
      logger.warn(`Unauthorized update attempt by user id: ${req.user.id}`);
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden: You don't have permission to update this user",
        },
      });
    }

    if (userId === parseInt(id) && role.level < user.Role.level) {
      logger.warn(`User id: ${req.user.id} attempted to downgrade their own role`);
      return res.status(400).json({
        meta: {
          code: 400,
          message: "You cannot downgrade your own role",
        },
      });
    }

    await user.update({ name, email, password, roleId, branchId });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User updated successfully",
      },
      data: user,
    });
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const level = req.user.Role.level;
    const user = await User.findByPk(id, {
      include: {
        model: Role,
      },
    });
    if (!user) {
      logger.warn(`User not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (user.Role.level < level) {
      logger.warn(`Unauthorized delete attempt by user id: ${req.user.id}`);
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden: You don't have permission to delete this user",
        },
      });
    }
    await user.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User deleted successfully",
      },
    });
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

const profile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role }, { model: Branch }],
    });
    if (!user) {
      logger.warn(`User not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User fetched successfully",
      },
      data: user,
    });
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

const changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(id);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid old password for user with id: ${id}`);
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Invalid old password",
        },
      });
    }
    const isPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isPasswordSame) {
      logger.warn(`New password cannot be the same as old password for user with id: ${id}`);
      return res.status(400).json({
        meta: {
          code: 400,
          message: "New password cannot be the same as old password",
        },
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Password changed successfully",
      },
    });
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
  show,
  update,
  destroy,
  create,
  profile,
  changePassword,
};
