import logger from "../log/logger.js";
import { Company, User } from "../model/index.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { companies, count } = await Company.findAndCountAll({
      limit,
      offset,
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Companies fetched successfully",
      },
      data: companies,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Error getting companies: ${error.message}`);
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
    const company = await Company.findOne({
      where: {
        id,
      },
    });
    if (!company) {
      logger.warn(`Company not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Company not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Company fetched successfully",
      },
      data: company,
    });
  } catch (error) {
    logger.error(`Error getting company: ${error}`);
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
    const { name, address, phone } = req.body;
    const company = await Company.findOne({
      where: {
        id,
      },
    });
    if (!company) {
      logger.warn(`Company not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Company not found",
        },
      });
    }
    await company.update({ name, address, phone });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Company updated successfully",
      },
      data: company,
    });
  } catch (error) {
    logger.error(`Error updating company: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, show, update };
