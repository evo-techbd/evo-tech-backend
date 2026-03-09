import { FinanceTransaction } from "./finance.model";
import { TFinanceTransaction } from "./finance.interface";
import { OrderItem } from "../order/order.model";
import { PrintingSale } from "../printing-sale/printing-sale.model";

const addTransactionIntoDB = async (payload: TFinanceTransaction) => {
  const result = await FinanceTransaction.create(payload);
  return result;
};

const getAllTransactionsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await FinanceTransaction.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "firstName lastName email");

  const total = await FinanceTransaction.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    result,
  };
};

const getFinanceStatsFromDB = async () => {
  // Aggregate Finance Transactions + Printing Sales in parallel
  const [financeStats, printingSalesTotal] = await Promise.all([
    FinanceTransaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    PrintingSale.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]),
  ]);

  let totalInvestment = 0;
  let totalWithdraw = 0;
  let totalExpense = 0;

  financeStats.forEach((stat) => {
    if (stat._id === "investment") totalInvestment = stat.total;
    if (stat._id === "withdraw") totalWithdraw = stat.total;
    if (stat._id === "expense") totalExpense = stat.total;
  });

  // Calculate All-Time Sales Profit from OrderItems
  const salesProfitStats = await OrderItem.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productData",
      },
    },
    { $unwind: "$productData" },
    {
      $project: {
        profit: {
          $multiply: [
            {
              $subtract: [
                "$productPrice",
                { $ifNull: ["$productData.buyingPrice", 0] },
              ],
            },
            "$quantity",
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: "$profit" },
      },
    },
  ]);

  const orderSalesProfit =
    salesProfitStats.length > 0 ? salesProfitStats[0].totalProfit : 0;

  // Printing sales are 100% profit (custom items, no buying cost)
  const printingSalesProfit =
    printingSalesTotal.length > 0 ? printingSalesTotal[0].total : 0;

  const totalSalesProfit = orderSalesProfit + printingSalesProfit;

  const totalMoneyIn = totalInvestment + totalSalesProfit;
  const totalMoneyOut = totalWithdraw + totalExpense;
  const currentBalance = totalMoneyIn - totalMoneyOut;

  return {
    totalInvestment,
    totalWithdraw,
    totalExpense,
    totalSalesProfit,
    printingSalesProfit,
    orderSalesProfit,
    currentBalance,
  };
};

const getSalesProfitTransactionsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch order profit items
  const orderProfitResult = await OrderItem.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productData",
      },
    },
    { $unwind: "$productData" },
    {
      $project: {
        _id: 1,
        date: "$createdAt",
        productName: "$productName",
        sellingPrice: "$productPrice",
        buyingPrice: { $ifNull: ["$productData.buyingPrice", 0] },
        quantity: "$quantity",
        profit: {
          $multiply: [
            {
              $subtract: [
                "$productPrice",
                { $ifNull: ["$productData.buyingPrice", 0] },
              ],
            },
            "$quantity",
          ],
        },
        source: { $literal: "order" },
      },
    },
    { $sort: { date: -1 } },
  ]);

  // Fetch printing sale items (flattened from embedded items array)
  const printingProfitResult = await PrintingSale.aggregate([
    {
      $match: { paymentStatus: "paid" },
    },
    { $unwind: "$items" },
    {
      $project: {
        _id: { $concat: [{ $toString: "$_id" }, "-", "$items.productName"] },
        date: "$createdAt",
        productName: { $concat: ["[3D] ", "$items.productName"] },
        sellingPrice: "$items.unitPrice",
        buyingPrice: { $literal: 0 },
        quantity: "$items.quantity",
        profit: "$items.price",
        source: { $literal: "printing" },
      },
    },
    { $sort: { date: -1 } },
  ]);

  // Merge and sort by date
  const allItems = [...orderProfitResult, ...printingProfitResult].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const total = allItems.length;
  const data = allItems.slice(skip, skip + limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    result: data,
  };
};

export const FinanceServices = {
  addTransactionIntoDB,
  getAllTransactionsFromDB,
  getFinanceStatsFromDB,
  getSalesProfitTransactionsFromDB,
};
