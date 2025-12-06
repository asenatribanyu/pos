import { ProductCategory } from "../model/index.js";
import logger from "../log/logger.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let whereClause = {};
    if (req.user.role.level == "developer") {
      logger.info(`Developer access product category list by userId: ${req.user.id}`);
      whereClause = {};
    } else if (req.user.role.level == "company") {
      whereClause = { companyId: req.user.companyId };
    }
    const { rows: productCategories, count } = await ProductCategory.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product categories fetched successfully",
      },
      data: productCategories,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Error getting product categories: ${error}`);
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
    const { name, companyId } = req.body;
    const existingProductCategory = await ProductCategory.findOne({ where: { name, companyId } });
    if (existingProductCategory) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Product category already exists",
        },
      });
    }
    const productCategory = await ProductCategory.create({ name, companyId });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product category created successfully",
      },
      data: productCategory,
    });
  } catch (error) {
    logger.error(`Error creating product category: ${error}`);
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
    const productCategory = await ProductCategory.findOne({ where: { id } });
    if (!productCategory) {
      logger.warn(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product category fetched successfully",
      },
      data: productCategory,
    });
  } catch (error) {
    logger.error(`Error getting product category: ${error}`);
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
    const productCategory = await ProductCategory.findOne({ where: { id } });
    if (!productCategory) {
      logger.warn(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    await productCategory.update({ name });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product category updated successfully",
      },
      data: productCategory,
    });
  } catch (error) {
    logger.error(`Error updating product category: ${error}`);
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
    const productCategory = await ProductCategory.findOne({ where: { id } });
    if (!productCategory) {
      logger.warn(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    await productCategory.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product category deleted successfully",
      },
    });
  } catch (error) {
    logger.error(`Error deleting product category: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
