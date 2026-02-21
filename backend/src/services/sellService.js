import { db, Transaction, TransactionDetail, Product } from "../model/index.js";
import { applyStockChange } from "./productStockService.js";

const createSale = async ({ branchId, userId, items, paymentMethod }) => {
  if (!branchId || !userId || !items || items.length === 0) {
    throw new Error("Invalid sale data");
  }

  return await db.transaction(async (t) => {
    let totalAmount = 0;

    const productIds = items.map((i) => i.productId);
    const products = await Product.findAll({
      where: { id: productIds },
      transaction: t,
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      totalAmount += item.qty * product.price;
    }

    const sale = await Transaction.create(
      {
        branchId,
        userId,
        totalAmount,
        paymentMethod,
      },
      { transaction: t },
    );

    for (const item of items) {
      const product = productMap.get(item.productId);

      await TransactionDetail.create(
        {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.qty,
          price: product.price,
          subtotal: item.qty * product.price,
        },
        { transaction: t },
      );

      await applyStockChange({
        productId: item.productId,
        branchId,
        quantity: item.qty,
        type: "out",
        referenceType: "sale",
        referenceId: sale.id,
        transaction: t,
      });
    }

    return sale;
  });
};

const voidSale = async (saleId) => {
  if (!saleId) {
    throw new Error("Sale id is required");
  }

  return await db.transaction(async (t) => {
    const sale = await Transaction.findByPk(saleId, {
      include: [{ model: TransactionDetail }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (sale.status === "void") {
      throw new Error("Sale already voided");
    }

    // balikin stock
    for (const detail of sale.TransactionDetails) {
      await applyStockChange({
        productId: detail.productId,
        branchId: sale.branchId,
        quantity: detail.quantity,
        type: "in",
        referenceType: "sale_void",
        referenceId: sale.id,
        transaction: t,
      });
    }

    await sale.update({ status: "void" }, { transaction: t });

    return sale;
  });
};

export { createSale, voidSale };
