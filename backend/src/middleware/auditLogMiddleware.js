import authMiddleware from "./authMiddleware.js";
import logger from "../log/logger.js";

const index = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(req, "auditLog.index");
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: { code: 401, message: "You Don't Have Permission" },
      });
    }
    next();
  } catch (error) {
    logger.error(`Error getting audit logs: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

export default { index };
