import Joi from "joi";
import logger from "../log/logger.js";
import authMiddleware from "./authMiddleware.js";

const sell = async (req, res, next) => {
  try {
    const granted = await authMiddleware.checkPermission(
      req,
      "transaction.create",
    );
    if (!granted) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        meta: {
          code: 401,
          message: "You Don't Have Permission",
        },
      });
    }
    const schema = Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.number().required(),
            qty: Joi.number().required(),
          }),
        )
        .required(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    next();
  } catch (error) {
    logger.error(`Error create transaction in Middleware: ${error}`);
    return res.status(500).json({
      meta: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
};

export default { sell };
