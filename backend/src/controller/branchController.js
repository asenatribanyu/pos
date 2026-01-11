import { Branch } from "../model/index.js";
import logger from "../log/logger.js";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { city: { [Op.iLike]: `%${search}%` } }],
      };
    }

    const { rows: branches, count } = await Branch.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Branches fetched successfully",
      },
      data: branches,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Error getting branches: ${error}`);
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
    const { name, city, address, phone } = req.body;
    const existingBranch = await Branch.findOne({ where: { name, city } });
    if (existingBranch) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: `Branch with name ${name} and city ${city} already exists`,
        },
      });
    }
    const branch = await Branch.create({ name, city, address, phone });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Branch created successfully",
      },
      data: branch,
    });
  } catch (error) {
    logger.error(`Error creating branch: ${error}`);
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
    const branch = await Branch.findOne({ where: { id } });
    if (!branch) {
      logger.warn(`Branch not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Branch not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Branch fetched successfully",
      },
      data: branch,
    });
  } catch (error) {
    logger.error(`Error getting branch: ${error}`);
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
    const { name, city, address, phone } = req.body;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      logger.warn(`Branch not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Branch not found",
        },
      });
    }
    await branch.update({ name, city, address, phone });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Branch updated successfully",
      },
      data: branch,
    });
  } catch (error) {
    logger.error(`Error updating branch: ${error}`);
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
    const branch = await Branch.findByPk(id);
    if (!branch) {
      logger.warn(`Branch not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Branch not found",
        },
      });
    }
    await branch.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Branch deleted successfully",
      },
    });
  } catch (error) {
    logger.error(`Error deleting branch: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
