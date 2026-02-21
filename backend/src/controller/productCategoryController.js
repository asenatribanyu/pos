import { ProductCategory } from "../model/index.js";
import logger from "../log/logger.js";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    let whereCondition = {};

    if (search && typeof search === "string") {
      whereCondition.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    const { rows: productCategories, count } =
      await ProductCategory.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["name", "ASC"]],
      });
    logger.info(
      `User with id: ${req.user.id} Getting product categories with search: ${search}`,
    );
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
    const { name } = req.body;
    const existingProductCategory = await ProductCategory.findOne({
      where: { name: { [Op.iLike]: name } },
    });
    if (existingProductCategory) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Product category already exists",
        },
      });
    }
    const productCategory = await ProductCategory.create({ name });
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
    const productCategory = await ProductCategory.findByPk(id);
    if (!productCategory) {
      logger.info(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    } else {
      return res.status(200).json({
        meta: {
          code: 200,
          message: "Product category fetched successfully",
        },
        data: productCategory,
      });
    }
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
    const productCategory = await ProductCategory.findByPk(id);
    if (!productCategory) {
      logger.info(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    const existingProductCategory = await ProductCategory.findOne({
      where: {
        [Op.and]: [{ name: { [Op.iLike]: name } }, { id: { [Op.ne]: id } }],
      },
    });
    if (existingProductCategory) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Product category already exists",
        },
      });
    }
    await productCategory.update({
      name,
    });

    logger.info(
      `User with id: ${req.user.id} updated product category with id: ${productCategory.id}`,
    );

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
    const productCategory = await ProductCategory.findByPk(id);
    if (!productCategory) {
      logger.info(`Product category not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    await productCategory.destroy();
    logger.info(
      `User with id: ${req.user.id} deleted product category with id: ${productCategory.id}`,
    );
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
