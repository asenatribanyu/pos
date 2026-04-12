import models from "../model/index.js";
const { Stock, StockMovement } = models;
import logger from "../log/logger.js";

const applyStockChange = async ({
  productId,
  quantity,
  type,
  referenceType,
  referenceId = null,
  transaction = null,
}) => {
  const execute = async (t) => {
    let stock = await Stock.findOne({
      where: { productId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!stock) {
      stock = await Stock.create(
        { productId, quantity: 0 },
        { transaction: t },
      );
    }

    const previousQty = stock.quantity;
    let newQty;

    if (type === "in") {
      newQty = previousQty + quantity;
    } else {
      if (previousQty < quantity) {
        throw new Error("Stock not enough");
      }
      newQty = previousQty - quantity;
    }

    await stock.update({ quantity: newQty }, { transaction: t });

    await StockMovement.create(
      {
        productId,
        type,
        referenceType,
        referenceId,
        quantity,
      },
      { transaction: t },
    );

    return { previousQty, newQty };
  };

  if (transaction) {
    return await execute(transaction);
  }

  return await db.transaction(async (t) => {
    return await execute(t);
  });
};

const adjustStockFromOpname = async ({
  productId,
  physicalQty,
  transaction = null,
}) => {
  const execute = async (t) => {
    const stock = await Stock.findOne({
      where: { productId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!stock) {
      throw new Error("Stock not found");
    }

    const systemQty = stock.quantity;
    const difference = physicalQty - systemQty;

    if (difference === 0) {
      return { message: "No adjustment needed" };
    }

    const type = difference > 0 ? "in" : "out";

    return await applyStockChange({
      productId,
      quantity: Math.abs(difference),
      type,
      referenceType: "opname",
      transaction: t,
    });
  };

  if (transaction) {
    return await execute(transaction);
  }

  return await db.transaction(async (t) => {
    return await execute(t);
  });
};

export { applyStockChange, adjustStockFromOpname };
