import logger from "../log/logger.js";
import { createSale, voidSale } from "../services/sellService.js";

const sell = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.id;
    const branchId = req.user.branchId;
    const sale = await createSale({ branchId, userId, items, paymentMethod });

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

const cancelSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await voidSale(id);

    return res.status(200).json({
      meta: { code: 200, message: "Sale voided successfully" },
      data: sale,
    });
  } catch (error) {
    logger.error(`Error voiding sale: ${error}`);
    return res.status(400).json({
      meta: { code: 400, message: error.message },
    });
  }
};

export default { sell, cancelSale };
