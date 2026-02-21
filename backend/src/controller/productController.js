import { Product, ProductCategory } from "../model/index.js";
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
    const { rows: products, count } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["name", "ASC"]],
      include: [
        {
          model: ProductCategory,
        },
      ],
    });
    logger.info(
      `User with id: ${req.user.id} Getting products with search: ${search}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Products fetched successfully",
      },
      data: products,
      pagination: {
        page,
        limit,
        total: count,
      },
    });
  } catch (error) {
    logger.error(`Error getting products: ${error}`);
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
    const { categoryId, name, description, type, price, costPrice } = req.body;
    const productCategory = await ProductCategory.findByPk(categoryId);
    if (!productCategory) {
      logger.warn(`Product category not found with id: ${categoryId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    const product = await Product.create({
      categoryId,
      name,
      description,
      type,
      price,
      costPrice,
    });
    logger.info(
      `User with id: ${req.user.id} created Product with id: ${product.id}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product created successfully",
      },
      data: product,
    });
  } catch (error) {
    logger.error(`Error creating product: ${error}`);
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
    const product = await Product.findByPk(id);
    if (!product) {
      logger.warn(`Product not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product not found",
        },
      });
    }
    logger.info(
      `User with id: ${req.user.id} Getting product with id: ${product.id}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product fetched successfully",
      },
      data: product,
    });
  } catch (error) {
    logger.error(`Error getting product: ${error}`);
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
    const { categoryId, name, description, type, price, costPrice } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      logger.warn(`Product not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product not found",
        },
      });
    }
    await product.update({
      categoryId,
      name,
      description,
      type,
      price,
      costPrice,
    });
    logger.info(
      `User with id: ${req.user.id} updated Product with id: ${product.id}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product updated successfully",
      },
      data: product,
    });
  } catch (error) {
    logger.info(`Error updating product: ${error}`);
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
    const product = await Product.findByPk(id);
    if (!product) {
      logger.warn(`Product not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product not found",
        },
      });
    }
    await product.destroy();
    logger.info(
      `User with id: ${req.user.id} deleted Product with id: ${product.id}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product deleted successfully",
      },
    });
  } catch (error) {
    logger.error(`Error deleting product: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { index, create, show, update, destroy };
