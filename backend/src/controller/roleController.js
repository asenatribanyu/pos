import { Role, Permission, RolePermission } from "../model/index.js";
import logger from "../log/logger.js";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userLevel = req.user.Role.level;

    let whereClause = {
      level: {
        [Op.gte]: userLevel,
      },
    };

    if (search) {
      if (!isNaN(search)) {
        whereClause = {
          [Op.and]: [
            { level: { [Op.gte]: userLevel } },
            { level: { [Op.eq]: Number(search) } },
          ],
        };
      } else {
        whereClause = {
          [Op.and]: [
            { level: { [Op.gte]: userLevel } },
            { name: { [Op.iLike]: `%${search}%` } },
          ],
        };
      }
    }
    const { rows: roles, count } = await Role.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Roles fetched successfully",
      },
      data: roles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
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

const create = async (req, res) => {
  try {
    const { name, permissionIds, level } = req.body;
    const levelCreateor = req.user.Role.level;
    if (level < levelCreateor) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Cannot create role with level higher than your own",
        },
      });
    }
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Role already exists",
        },
      });
    }
    const role = await Role.create({ name, level });
    await RolePermission.bulkCreate(
      permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })),
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Role created successfully",
      },
      data: role,
    });
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

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: { model: Permission, through: { attributes: [] } },
    });
    if (!role) {
      logger.warn(`Role not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Role not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Role fetched successfully",
      },
      data: role,
    });
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissionIds, level } = req.body;
    const levelUpdater = req.user.Role.level;
    if (level <= levelUpdater) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Cannot set role to a level higher than your own",
        },
      });
    }
    const role = await Role.findByPk(id);
    await RolePermission.destroy({ where: { roleId: id } });
    await RolePermission.bulkCreate(
      permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
    );
    if (!role) {
      logger.warn(`Role not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Role not found",
        },
      });
    }
    await role.update({ name, level });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Role updated successfully",
      },
      data: role,
    });
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      logger.warn(`Role not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Role not found",
        },
      });
    }
    await role.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Role deleted successfully",
      },
    });
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
