import { User } from "../user/user.model";
import { Order, OrderItem } from "../order/order.model";
import { Product } from "../product/product.model";
import { PrintingSale } from "../printing-sale/printing-sale.model";

type DateRange = "today" | "this-week" | "this-month" | "all-time";

const getDateRanges = (range: DateRange = "this-month") => {
  const now = new Date();
  let currentStart: Date;
  let currentEnd: Date;
  let previousStart: Date;
  let previousEnd: Date;

  switch (range) {
    case "today":
      // Today
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      currentEnd = now;
      // Yesterday
      previousStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      previousEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        -1,
      );
      break;

    case "this-week":
      // This week (Monday to Sunday)
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      currentStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + diffToMonday,
      );
      currentEnd = now;
      // Last week
      previousStart = new Date(
        currentStart.getFullYear(),
        currentStart.getMonth(),
        currentStart.getDate() - 7,
      );
      previousEnd = new Date(
        currentStart.getFullYear(),
        currentStart.getMonth(),
        currentStart.getDate(),
        0,
        0,
        0,
        -1,
      );
      break;

    case "all-time":
      // All time - start from earliest possible date
      currentStart = new Date(2000, 0, 1);
      currentEnd = now;
      // Compare with a year ago
      previousStart = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate(),
      );
      previousEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        -1,
      );
      break;

    case "this-month":
    default:
      // This month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = now;
      // Last month
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
};

const getDashboardStats = async (range: DateRange = "this-month") => {
  const now = new Date();
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getDateRanges(range);

  // Fetch orders + printing sales in parallel
  const [
    totalUsers,
    totalProducts,
    currentPeriodOrders,
    previousPeriodOrders,
    currentPrintingSales,
    previousPrintingSales,
  ] = await Promise.all([
    User.countDocuments({ userType: "user" }),
    Product.countDocuments({ published: true }),
    Order.find({
      createdAt: { $gte: currentStart, $lte: currentEnd },
      orderStatus: { $ne: "cancelled" },
    }),
    Order.find({
      createdAt: { $gte: previousStart, $lte: previousEnd },
      orderStatus: { $ne: "cancelled" },
    }),
    PrintingSale.find({
      createdAt: { $gte: currentStart, $lte: currentEnd },
      paymentStatus: "paid",
    }),
    PrintingSale.find({
      createdAt: { $gte: previousStart, $lte: previousEnd },
      paymentStatus: "paid",
    }),
  ]);

  // Order breakdown by status
  const orderBreakdown = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: currentStart, $lte: currentEnd },
      },
    },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const breakdown: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orderBreakdown.forEach((item) => {
    if (item._id && breakdown.hasOwnProperty(item._id)) {
      breakdown[item._id] = item.count;
    }
  });

  // --- Regular order revenue ---
  const currentOrderRevenue = currentPeriodOrders.reduce(
    (sum, order) => sum + (order.amountPaid || 0),
    0,
  );
  const previousOrderRevenue = previousPeriodOrders.reduce(
    (sum, order) => sum + (order.amountPaid || 0),
    0,
  );

  // --- 3D Printing sale revenue ---
  const currentPrintingRevenue = currentPrintingSales.reduce(
    (sum, sale) => sum + (sale.totalPrice || 0),
    0,
  );
  const previousPrintingRevenue = previousPrintingSales.reduce(
    (sum, sale) => sum + (sale.totalPrice || 0),
    0,
  );

  // Combined revenue
  const currentPeriodRevenue = currentOrderRevenue + currentPrintingRevenue;
  const previousPeriodRevenue = previousOrderRevenue + previousPrintingRevenue;

  // --- Order cost calculation ---
  const currentPeriodOrderIds = currentPeriodOrders.map((order) => order._id);
  const currentPeriodOrderItems = await OrderItem.find({
    order: { $in: currentPeriodOrderIds },
  }).populate("product");

  let totalCost = 0;
  let itemsWithoutBuyingPrice = 0;

  for (const item of currentPeriodOrderItems) {
    let product = item.product as any;

    if (!product) {
      const productByName = await Product.findOne({ name: item.productName });
      if (productByName) {
        product = productByName;
      }
    }

    const buyingPrice = product?.buyingPrice || 0;
    const quantity = item.quantity;
    const itemCost = buyingPrice * quantity;

    if (!product?.buyingPrice) {
      itemsWithoutBuyingPrice++;
    }
    totalCost += itemCost;
  }

  // Printing sales are custom — 100% profit (no buying cost)
  const totalProfit = currentPeriodRevenue - totalCost;

  // Previous period profit
  const previousPeriodOrderIds = previousPeriodOrders.map((order) => order._id);
  const previousPeriodOrderItems = await OrderItem.find({
    order: { $in: previousPeriodOrderIds },
  }).populate("product");

  let previousPeriodCost = 0;
  for (const item of previousPeriodOrderItems) {
    let product = item.product as any;

    if (!product) {
      product = await Product.findOne({ name: item.productName });
    }

    const buyingPrice = product?.buyingPrice || 0;
    const itemCost = buyingPrice * item.quantity;
    previousPeriodCost += itemCost;
  }

  const previousPeriodProfit = previousPeriodRevenue - previousPeriodCost;

  const profitGrowth =
    previousPeriodProfit > 0
      ? ((totalProfit - previousPeriodProfit) / previousPeriodProfit) * 100
      : 0;

  const revenueGrowth =
    previousPeriodRevenue > 0
      ? ((currentPeriodRevenue - previousPeriodRevenue) /
          previousPeriodRevenue) *
        100
      : 0;

  const totalCurrentSalesCount =
    currentPeriodOrders.length + currentPrintingSales.length;
  const totalPreviousSalesCount =
    previousPeriodOrders.length + previousPrintingSales.length;

  const ordersGrowth =
    totalPreviousSalesCount > 0
      ? ((totalCurrentSalesCount - totalPreviousSalesCount) /
          totalPreviousSalesCount) *
        100
      : 0;

  // Customer & product growth
  const currentPeriodUsers = await User.countDocuments({
    userType: "user",
    createdAt: { $gte: currentStart, $lte: currentEnd },
  });

  const previousPeriodUsers = await User.countDocuments({
    userType: "user",
    createdAt: { $gte: previousStart, $lte: previousEnd },
  });

  const customersGrowth =
    previousPeriodUsers > 0
      ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100
      : 0;

  const currentPeriodProducts = await Product.countDocuments({
    isActive: true,
    createdAt: { $gte: currentStart, $lte: currentEnd },
  });

  const previousPeriodProducts = await Product.countDocuments({
    isActive: true,
    createdAt: { $gte: previousStart, $lte: previousEnd },
  });

  const productsGrowth =
    previousPeriodProducts > 0
      ? ((currentPeriodProducts - previousPeriodProducts) /
          previousPeriodProducts) *
        100
      : 0;

  return {
    totalRevenue: currentPeriodRevenue,
    totalProfit: totalProfit,
    profitGrowth: Math.round(profitGrowth * 100) / 100,
    totalOrders: totalCurrentSalesCount,
    totalCustomers: totalUsers,
    totalProducts: totalProducts,
    revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    ordersGrowth: Math.round(ordersGrowth * 100) / 100,
    customersGrowth: Math.round(customersGrowth * 100) / 100,
    productsGrowth: Math.round(productsGrowth * 100) / 100,
    orderBreakdown: breakdown,
    // Revenue breakdown: regular vs 3D printing
    revenueBreakdown: {
      orderRevenue: currentOrderRevenue,
      printingRevenue: currentPrintingRevenue,
      orderCount: currentPeriodOrders.length,
      printingSalesCount: currentPrintingSales.length,
    },
    profitWarning:
      itemsWithoutBuyingPrice > 0
        ? {
            message: `${itemsWithoutBuyingPrice} order item(s) are missing buying prices. Profit calculation may be inaccurate.`,
            itemsAffected: itemsWithoutBuyingPrice,
          }
        : null,
  };
};

const getSalesData = async (period: string = "30d") => {
  const now = new Date();
  let startDate: Date;
  let dateFormat: string;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
    default: // 30d
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
  }

  // Fetch both data sources in parallel
  const [orderSalesData, printingSalesData] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          sales: { $sum: { $ifNull: ["$amountPaid", 0] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    PrintingSale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          sales: { $sum: { $ifNull: ["$totalPrice", 0] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Merge both datasets by date
  const mergedMap = new Map<string, { date: string; sales: number; orders: number; orderSales: number; printingSales: number }>();

  for (const item of orderSalesData) {
    mergedMap.set(item._id, {
      date: item._id,
      sales: item.sales,
      orders: item.orders,
      orderSales: item.sales,
      printingSales: 0,
    });
  }

  for (const item of printingSalesData) {
    const existing = mergedMap.get(item._id);
    if (existing) {
      existing.sales += item.sales;
      existing.orders += item.orders;
      existing.printingSales = item.sales;
    } else {
      mergedMap.set(item._id, {
        date: item._id,
        sales: item.sales,
        orders: item.orders,
        orderSales: 0,
        printingSales: item.sales,
      });
    }
  }

  // Sort by date
  const salesData = Array.from(mergedMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return salesData;
};

const getRecentOrders = async (limit: number = 10) => {
  // Get all orders and sort: pending first, then by creation date
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "firstName lastName email")
    .lean();

  // Sort to show pending orders first
  const sortedOrders = orders.sort((a, b) => {
    if (a.orderStatus === "pending" && b.orderStatus !== "pending") return -1;
    if (a.orderStatus !== "pending" && b.orderStatus === "pending") return 1;
    return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
  });

  return sortedOrders.map((order) => ({
    id: order._id,
    orderNumber: order.orderNumber || `ORD-${order._id}`,
    customer: (() => {
      if (order.user) {
        const first =
          (order.user as any).firstName || (order.user as any).firstname || "";
        const last =
          (order.user as any).lastName || (order.user as any).lastname || "";
        const full = `${first} ${last}`.trim();
        if (full) return full;
      }
      const firstName =
        (order as any).firstname || (order as any).firstName || "";
      const lastName = (order as any).lastname || (order as any).lastName || "";
      const fullFallback = `${firstName} ${lastName}`.trim();
      return fullFallback || order.email || "Unknown";
    })(),
    customerEmail: order.user ? (order.user as any).email : order.email || "",
    total: order.totalPayable || 0,
    status: order.orderStatus || "pending",
    createdAt: order.createdAt,
  }));
};

const getTopProducts = async (limit: number = 10) => {
  // This would require order items collection to get actual sales data
  // For now, we'll return products sorted by creation date as a placeholder
  const products = await Product.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map((product, index) => ({
    id: product._id,
    name: product.name,
    image: product.mainImage || "/placeholder-product.jpg",
    category: product.category || "Uncategorized",
    price: product.price || 0,
    sold: Math.floor(Math.random() * 100) + 1, // Mock data for now
    revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 1),
    stock: product.stock || 0,
    trend: index % 3 === 0 ? "up" : index % 3 === 1 ? "down" : "stable",
  }));
};

const getEarningsReport = async () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
  const fiveYearsAgo = new Date(now.getFullYear() - 4, 0, 1);

  // Fetch all order data + printing sales data in parallel
  const [
    allOrders,
    yearOrders,
    monthOrders,
    lastMonthOrders,
    lastYearOrders,
    allPrintingSales,
    yearPrintingSales,
    monthPrintingSales,
    lastMonthPrintingSales,
    lastYearPrintingSales,
    orderMonthlyBreakdown,
    orderYearlyBreakdown,
    printingMonthlyBreakdown,
    printingYearlyBreakdown,
  ] = await Promise.all([
    Order.find({ orderStatus: { $ne: "cancelled" } }),
    Order.find({ createdAt: { $gte: startOfYear, $lte: now }, orderStatus: { $ne: "cancelled" } }),
    Order.find({ createdAt: { $gte: startOfMonth, $lte: now }, orderStatus: { $ne: "cancelled" } }),
    Order.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, orderStatus: { $ne: "cancelled" } }),
    Order.find({ createdAt: { $gte: startOfLastYear, $lte: endOfLastYear }, orderStatus: { $ne: "cancelled" } }),
    PrintingSale.find({ paymentStatus: "paid" }),
    PrintingSale.find({ createdAt: { $gte: startOfYear, $lte: now }, paymentStatus: "paid" }),
    PrintingSale.find({ createdAt: { $gte: startOfMonth, $lte: now }, paymentStatus: "paid" }),
    PrintingSale.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, paymentStatus: "paid" }),
    PrintingSale.find({ createdAt: { $gte: startOfLastYear, $lte: endOfLastYear }, paymentStatus: "paid" }),
    // Monthly breakdown aggregations
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: now }, orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: { $month: "$createdAt" }, earnings: { $sum: "$amountPaid" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: fiveYearsAgo, $lte: now }, orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: { $year: "$createdAt" }, earnings: { $sum: "$amountPaid" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    PrintingSale.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: now }, paymentStatus: "paid" } },
      { $group: { _id: { $month: "$createdAt" }, earnings: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    PrintingSale.aggregate([
      { $match: { createdAt: { $gte: fiveYearsAgo, $lte: now }, paymentStatus: "paid" } },
      { $group: { _id: { $year: "$createdAt" }, earnings: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Helper to sum revenue
  const sumOrders = (orders: any[]) => orders.reduce((s, o) => s + (o.amountPaid || 0), 0);
  const sumPrinting = (sales: any[]) => sales.reduce((s, p) => s + (p.totalPrice || 0), 0);

  const totalEarnings = sumOrders(allOrders) + sumPrinting(allPrintingSales);
  const yearlyEarnings = sumOrders(yearOrders) + sumPrinting(yearPrintingSales);
  const monthlyEarnings = sumOrders(monthOrders) + sumPrinting(monthPrintingSales);
  const lastMonthEarnings = sumOrders(lastMonthOrders) + sumPrinting(lastMonthPrintingSales);
  const lastYearEarnings = sumOrders(lastYearOrders) + sumPrinting(lastYearPrintingSales);

  const totalCount = allOrders.length + allPrintingSales.length;
  const yearCount = yearOrders.length + yearPrintingSales.length;
  const monthCount = monthOrders.length + monthPrintingSales.length;

  const monthlyGrowth =
    lastMonthEarnings > 0
      ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
      : 0;

  const yearlyGrowth =
    lastYearEarnings > 0
      ? ((yearlyEarnings - lastYearEarnings) / lastYearEarnings) * 100
      : 0;

  // Merge monthly breakdowns
  const mergeBreakdown = (orderData: any[], printingData: any[], key: string) => {
    const map = new Map<number, { earnings: number; orders: number }>();
    for (const item of orderData) {
      map.set(item._id, { earnings: item.earnings || 0, orders: item.orders || 0 });
    }
    for (const item of printingData) {
      const existing = map.get(item._id);
      if (existing) {
        existing.earnings += item.earnings || 0;
        existing.orders += item.orders || 0;
      } else {
        map.set(item._id, { earnings: item.earnings || 0, orders: item.orders || 0 });
      }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([id, data]) => ({ [key]: id, earnings: data.earnings, orders: data.orders }));
  };

  return {
    total: {
      earnings: totalEarnings,
      orders: totalCount,
    },
    yearly: {
      earnings: yearlyEarnings,
      orders: yearCount,
      growth: Math.round(yearlyGrowth * 100) / 100,
      breakdown: mergeBreakdown(orderYearlyBreakdown, printingYearlyBreakdown, "year"),
    },
    monthly: {
      earnings: monthlyEarnings,
      orders: monthCount,
      growth: Math.round(monthlyGrowth * 100) / 100,
      breakdown: mergeBreakdown(orderMonthlyBreakdown, printingMonthlyBreakdown, "month"),
    },
    avgOrderValue: totalCount > 0 ? totalEarnings / totalCount : 0,
  };
};

const getPendingOrdersCount = async () => {
  // Get count of orders that are pending (not processed yet)
  const pendingCount = await Order.countDocuments({
    orderStatus: "pending",
  });

  return {
    count: pendingCount,
  };
};

export const DashboardServices = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
  getEarningsReport,
  getPendingOrdersCount,
};
