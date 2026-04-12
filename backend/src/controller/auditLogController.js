import models from "../model/index.js";
const { auditLog } = models;
import logger from "../log/logger.js";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const { branchId } = req.query;
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
    const { rows: auditLogs, count } = await auditLog.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "ASC"]],
      include: [
        {
          model: Branch,
          where: {
            id: branchId,
          },
        },
      ],
    });
    logger.info(
      `User with id: ${req.user.id} Getting audit logs with search: ${search}`,
    );
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Audit logs fetched successfully",
      },
      data: auditLogs,
      pagination: {
        page,
        limit,
        total: count,
      },
    });
  } catch (error) {
    logger.error(`Error getting audit logs: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

export default { index };
