import models from "../model/index.js";
const { auditLog } = models;
import logger from "../log/logger.js";

export async function createAuditLog(
  userId,
  action,
  entityType,
  entityId,
  summary,
  metadata,
) {
  try {
    await auditLog.create({
      userId,
      action,
      entityType,
      entityId,
      summary,
      metadata,
    });
  } catch (error) {
    logger.error("Error creating audit log:", error);
  }
}
