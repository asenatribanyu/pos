import { Permission } from "../model/index.js";
import logger from "../log/logger.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let paginantion = {};
    const disablePaginantion = req.query.disablePaginantion === "true";
    if (!disablePaginantion) {
      paginantion = { limit, offset };
    }
    const { rows: permissions, count } = await Permission.findAndCountAll({
      ...paginantion,
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Permissions fetched successfully",
      },
      data: permissions,
      ...(!disablePaginantion && {
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      }),
    });
  } catch (error) {
    logger.error(`Error getting permissions: ${error}`);
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
    const { name } = req.body;
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Permission already exists",
        },
      });
    }
    const permission = await Permission.create({ name });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Permission created successfully",
      },
      data: permission,
    });
  } catch (error) {
    logger.error(`Error creating permission: ${error}`);
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
    const permission = await Permission.findByPk(id);
    if (!permission) {
      logger.warn(`Permission not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Permission not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Permission fetched successfully",
      },
      data: permission,
    });
  } catch (error) {
    logger.error(`Error getting permission: ${error}`);
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
    const { name } = req.body;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      logger.warn(`Permission not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Permission not found",
        },
      });
    }
    await permission.update({ name });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Permission updated successfully",
      },
      data: permission,
    });
  } catch (error) {
    logger.error(`Error updating permission: ${error}`);
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
    const permission = await Permission.findByPk(id);
    if (!permission) {
      logger.warn(`Permission not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Permission not found",
        },
      });
    }
    await permission.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Permission deleted successfully",
      },
    });
  } catch (error) {
    logger.error(`Error deleting permission: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
