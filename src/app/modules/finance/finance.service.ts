import { FinanceTransaction } from "./finance.model";
import { TFinanceTransaction } from "./finance.interface";
import { OrderItem } from "../order/order.model";

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
  // Aggregate Finance Transactions
  const financeStats = await FinanceTransaction.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let totalInvestment = 0;
  let totalWithdraw = 0;
  let totalExpense = 0;

  financeStats.forEach((stat) => {
    if (stat._id === "investment") totalInvestment = stat.total;
    if (stat._id === "withdraw") totalWithdraw = stat.total;
    if (stat._id === "expense") totalExpense = stat.total;
  });

  // Calculate All-Time Sales Profit
  // Note: buyingPrice is from Product (current value), not historical in OrderItem
  const salesProfitStats = await OrderItem.aggregate([
    {
      $lookup: {
        from: "products", // collection name in MongoDB (usually lowercase plural)
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

  const totalSalesProfit =
    salesProfitStats.length > 0 ? salesProfitStats[0].totalProfit : 0;

  const totalMoneyIn = totalInvestment + totalSalesProfit;
  const totalMoneyOut = totalWithdraw + totalExpense;
  const currentBalance = totalMoneyIn - totalMoneyOut;

  return {
    totalInvestment,
    totalWithdraw,
    totalExpense,
    totalSalesProfit,
    currentBalance,
  };
};

const getSalesProfitTransactionsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await OrderItem.aggregate([
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
      },
    },
    { $sort: { date: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const data = result[0].data;
  const total = result[0].metadata[0]?.total || 0;

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
