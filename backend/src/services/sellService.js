import { db, Transaction, TransactionDetail, Product } from "../model/index.js";
import { applyStockChange } from "./productStockService.js";

export const createSale = async ({
  branchId,
  userId,
  items,
  paymentMethod,
}) => {
  if (!branchId || !userId || !items || items.length === 0) {
    throw new Error("Invalid sale data");
  }

  return await db.transaction(async (t) => {
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.qty || !item.price) {
        throw new Error("Invalid sale item");
      }

      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new Error(`Product with id: ${item.productId} not found`);
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
      const product = await Product.findByPk(item.productId);
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
