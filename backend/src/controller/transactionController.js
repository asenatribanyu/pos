import {
  Transaction,
  TransactionDetail,
  Product,
  ProductStock,
  StockMovement,
} from "../model/index.js";
import logger from "../log/logger.js";
import { createSale } from "../services/sellService.js";

const sell = async (req, res) => {
  try {
    const sale = await createSale(req.body);

    return res.status(201).json({
      meta: { code: 201, message: "Sale created successfully" },
      data: sale,
    });
  } catch (error) {
    logger.error(`Error selling product: ${error}`);
    return res
      .status(500)
      .json({ meta: { code: 500, message: "Internal Server Error" } });
  }
};

export default { sell };
