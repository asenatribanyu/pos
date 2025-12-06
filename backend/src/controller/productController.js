import { Product, ProductCategory, Company } from "../model/index.js";
import logger from "../log/logger.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let whereClause = {};
    if (req.user.role.level == "developer") {
      logger.info(`Developer access product list by userId: ${req.user.id}`);
      whereClause = {};
    } else {
      logger.warn(`Unauthorized access attempt by userId: ${req.user.id}`);
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    const { rows: products, count } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });
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
        totalPages: Math.ceil(count / limit),
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
    const { companyId, categoryId, name, description, basePrice, sellPrice, sku } = req.body;
    const company = await Company.findOne({
      where: {
        id: companyId,
      },
    });
    if (!company) {
      logger.warn(`Company not found with id: ${companyId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Company not found",
        },
      });
    }
    const category = await ProductCategory.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      logger.warn(`Product category not found with id: ${categoryId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product category not found",
        },
      });
    }
    const existingProduct = await Product.findOne({
      where: {
        name,
        companyId,
        categoryId,
      },
    });
    if (existingProduct) {
      logger.warn(`Product already exists with name: ${name}`);
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Product already exists",
        },
      });
    }
    let skuValue = sku === "" || sku === null || sku === undefined ? null : sku;
    const product = await Product.create({
      companyId,
      categoryId,
      name,
      description,
      basePrice,
      sellPrice,
      sku: skuValue,
    });
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
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      logger.warn(`Product not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product not found",
        },
      });
    }
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
    const { name, description, basePrice, sellPrice, sku } = req.body;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      logger.warn(`Product not found with id: ${id}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Product not found",
        },
      });
    }
    await product.update({ name, description, basePrice, sellPrice, sku });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Product updated successfully",
      },
      data: product,
    });
  } catch (error) {
    logger.error(`Error updating product: ${error}`);
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
    const product = await Product.findOne({ where: { id } });
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
