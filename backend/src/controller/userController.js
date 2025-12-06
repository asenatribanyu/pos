import { User } from "../model/index.js";
import logger from "../log/logger.js";

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const level = req.user.role.level;
    let whereClause = {};
    if (level == "branch") {
      whereClause = { branchId: req.user.branchId };
    } else if (level == "company") {
      whereClause = { companyId: req.user.companyId };
    } else {
      logger.warn(`Unauthorized access attempt by userId: ${req.user.id}`);
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }

    const [users, total] = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["name", "ASC"]],
    });
    if (total === 0) {
      logger.warn(`No users found for companyId: ${req.user.companyId}`);
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Not Found",
        },
      });
    }
    logger.info(`Fetched ${users.length} users for companyId: ${req.user.companyId}`);
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Success",
      },
      data: {
        users,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Error in userController index: ${error.message}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};
