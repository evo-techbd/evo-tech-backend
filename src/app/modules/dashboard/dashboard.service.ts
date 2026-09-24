import { Types } from "mongoose";
import { User } from "../user/user.model";
import { Order, OrderItem } from "../order/order.model";
import { Product } from "../product/product.model";
import { PrintingSale } from "../printing-sale/printing-sale.model";
// Registers the Category model for the top-products populate
import "../category/category.model";

type DateRange = "today" | "this-week" | "this-month" | "all-time";

/*
 * Accounting rules used by every figure on the dashboard
 * -------------------------------------------------------
 * Revenue (store orders): subtotal − discount of every order that is
 *   confirmed or further along (confirmed / processing / shipped / delivered)
 *   and whose payment has not failed or been refunded. Pending orders are not
 *   yet accepted sales; cancelled, failed and refunded ones never became sales.
 *   Delivery and additional charges (COD / bKash fees) are pass-through and
 *   excluded from revenue.
 * Revenue (3D printing): totalPrice of sales marked "paid".
 * Cost of goods: buyingPrice × quantity of the recognised orders' items.
 *   3D printing has no recorded cost, so its revenue is all profit.
 * Profit: gross profit = revenue − cost of goods.
 * Cash collected: amountPaid of non-refunded orders + paid printing sales —
 *   what actually reached the account, including delivery charges.
 * Sales are dated by when they were placed (createdAt), in Bangladesh time.
 */

const REVENUE_ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];
const NON_REVENUE_PAYMENT_STATUSES = ["failed", "refunded"];

// Bangladesh has no daylight saving, so a fixed offset is exact.
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const MONGO_TIMEZONE = "+06:00";
const DAY_MS = 24 * 60 * 60 * 1000;

// Wall-clock date parts of an instant, as seen in Bangladesh.
const dhakaParts = (date: Date) => {
  const shifted = new Date(date.getTime() + DHAKA_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(), // 0-11
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(), // 0 = Sunday
  };
};

// Instant at which the given Bangladesh calendar day starts. Out-of-range
// months/days roll over like the Date constructor (e.g. month 12 = next Jan).
const dhakaStartOf = (year: number, month: number, day = 1) =>
  new Date(Date.UTC(year, month, day) - DHAKA_OFFSET_MS);

type Period = { start: Date; end: Date }; // half-open: start <= t < end

const inPeriod = (period: Period) => ({
  $gte: period.start,
  $lt: period.end,
});

// Current period plus an equal-length slice of the previous period, so that
// "today so far" is compared with "yesterday up to the same time", etc.
const getPeriods = (
  range: DateRange,
  now: Date = new Date(),
): { current: Period; previous: Period | null } => {
  const { year, month, day, weekday } = dhakaParts(now);

  switch (range) {
    case "today": {
      const start = dhakaStartOf(year, month, day);
      return {
        current: { start, end: now },
        previous: {
          start: new Date(start.getTime() - DAY_MS),
          end: new Date(now.getTime() - DAY_MS),
        },
      };
    }

    case "this-week": {
      // Week runs Monday to Sunday
      const daysSinceMonday = (weekday + 6) % 7;
      const start = dhakaStartOf(year, month, day - daysSinceMonday);
      return {
        current: { start, end: now },
        previous: {
          start: new Date(start.getTime() - 7 * DAY_MS),
          end: new Date(now.getTime() - 7 * DAY_MS),
        },
      };
    }

    case "all-time":
      // Nothing earlier to compare against
      return { current: { start: new Date(0), end: now }, previous: null };

    case "this-month":
    default: {
      const start = dhakaStartOf(year, month, 1);
      const previousStart = dhakaStartOf(year, month - 1, 1);
      const elapsed = now.getTime() - start.getTime();
      // Clamp so a long month never reaches past the end of a shorter one
      const previousEnd = new Date(
        Math.min(previousStart.getTime() + elapsed, start.getTime()),
      );
      return {
        current: { start, end: now },
        previous: { start: previousStart, end: previousEnd },
      };
    }
  }
};

// Percentage change, or null when there is no meaningful base to compare to.
const percentChange = (current: number, previous: number | null) => {
  if (previous === null || previous === 0) return null;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return Math.round(change * 100) / 100;
};

const revenueOrderFilter = (period?: Period) => ({
  orderStatus: { $in: REVENUE_ORDER_STATUSES },
  paymentStatus: { $nin: NON_REVENUE_PAYMENT_STATUSES },
  ...(period ? { createdAt: inPeriod(period) } : {}),
});

const paidPrintingFilter = (period?: Period) => ({
  paymentStatus: "paid",
  ...(period ? { createdAt: inPeriod(period) } : {}),
});

const orderRevenue = (order: { subtotal?: number; discount?: number }) =>
  (order.subtotal || 0) - (order.discount || 0);

const ORDER_REVENUE_EXPR = {
  $subtract: [
    { $ifNull: ["$subtotal", 0] },
    { $ifNull: ["$discount", 0] },
  ],
};

// Buying price for each item of the given orders: the price stored on the
// order item at checkout, falling back to the product's current buying price
// (by reference, then by name if the product was re-created).
const loadOrderItemsWithCost = async (orderIds: Types.ObjectId[]) => {
  if (orderIds.length === 0) {
    return {
      items: [] as any[],
      itemsWithoutBuyingPrice: 0,
      productsMissingBuyingPrice: [] as MissingBuyingPrice[],
    };
  }

  const items: any[] = await OrderItem.find({ order: { $in: orderIds } })
    .populate("product", "name slug buyingPrice")
    .lean();

  const namesToLookUp = items
    .filter((item) => !item.buyingPrice && !item.product)
    .map((item) => item.productName);
  const productsByName = new Map<string, number>();
  if (namesToLookUp.length > 0) {
    const products = await Product.find({ name: { $in: namesToLookUp } })
      .select("name buyingPrice")
      .lean();
    for (const product of products) {
      productsByName.set(product.name, product.buyingPrice || 0);
    }
  }

  let itemsWithoutBuyingPrice = 0;
  const missingByProduct = new Map<string, MissingBuyingPrice>();
  for (const item of items) {
    let buyingPrice = item.buyingPrice || 0;
    if (!buyingPrice) {
      buyingPrice = item.product
        ? item.product.buyingPrice || 0
        : productsByName.get(item.productName) || 0;
    }
    if (!buyingPrice) {
      itemsWithoutBuyingPrice++;
      const key = item.product?._id?.toString() || `name:${item.productName}`;
      const entry = missingByProduct.get(key) || {
        productId: item.product?._id?.toString() || null,
        slug: item.product?.slug || null,
        name: item.product?.name || item.productName,
        unitsSold: 0,
      };
      entry.unitsSold += item.quantity;
      missingByProduct.set(key, entry);
    }
    item.resolvedBuyingPrice = buyingPrice;
    item.cost = buyingPrice * item.quantity;
  }

  const productsMissingBuyingPrice = Array.from(
    missingByProduct.values(),
  ).sort((a, b) => b.unitsSold - a.unitsSold);

  return { items, itemsWithoutBuyingPrice, productsMissingBuyingPrice };
};

type MissingBuyingPrice = {
  productId: string | null; // null when the product was deleted
  slug: string | null;
  name: string;
  unitsSold: number;
};

const buildProfitWarning = (
  itemsWithoutBuyingPrice: number,
  products: MissingBuyingPrice[],
) =>
  itemsWithoutBuyingPrice > 0
    ? {
        message: `${itemsWithoutBuyingPrice} order item(s) across ${products.length} product(s) have no buying price, so their cost is counted as 0 and profit is overstated.`,
        itemsAffected: itemsWithoutBuyingPrice,
        products,
      }
    : null;

// Revenue, cost and count of recognised store orders in a period.
const summarizeOrders = async (period?: Period) => {
  const orders = await Order.find(revenueOrderFilter(period))
    .select("_id subtotal discount deliveryCharge additionalCharge")
    .lean();

  const { items, itemsWithoutBuyingPrice, productsMissingBuyingPrice } =
    await loadOrderItemsWithCost(
      orders.map((order) => order._id as unknown as Types.ObjectId),
    );

  return {
    count: orders.length,
    revenue: orders.reduce((sum, order) => sum + orderRevenue(order), 0),
    cost: items.reduce((sum, item) => sum + item.cost, 0),
    deliveryFees: orders.reduce((s, o) => s + (o.deliveryCharge || 0), 0),
    additionalCharges: orders.reduce(
      (s, o) => s + (o.additionalCharge || 0),
      0,
    ),
    itemsWithoutBuyingPrice,
    productsMissingBuyingPrice,
  };
};

const summarizePrinting = async (period?: Period) => {
  const [result] = await PrintingSale.aggregate([
    { $match: paidPrintingFilter(period) },
    {
      $group: {
        _id: null,
        revenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
        count: { $sum: 1 },
      },
    },
  ]);
  return { revenue: result?.revenue || 0, count: result?.count || 0 };
};

// Amount received on an order. An order marked "paid" is settled in full even
// if amountPaid was never filled in (older orders marked paid from the status
// dropdown only changed the status).
const EFFECTIVE_PAID_EXPR = {
  $cond: [
    { $eq: ["$paymentStatus", "paid"] },
    {
      $max: [
        { $ifNull: ["$totalPayable", 0] },
        { $ifNull: ["$amountPaid", 0] },
      ],
    },
    { $ifNull: ["$amountPaid", 0] },
  ],
};

const sumCashCollectedFromOrders = async (period: Period) => {
  const [result] = await Order.aggregate([
    {
      $match: {
        createdAt: inPeriod(period),
        paymentStatus: { $ne: "refunded" },
      },
    },
    { $group: { _id: null, total: { $sum: EFFECTIVE_PAID_EXPR } } },
  ]);
  return result?.total || 0;
};

// Still owed by customers on recognised orders: partial payments, Group Buy
// balances, and COD orders not yet marked paid.
const sumReceivables = async (period: Period) => {
  const [result] = await Order.aggregate([
    { $match: revenueOrderFilter(period) },
    {
      $project: {
        due: {
          $max: [
            0,
            {
              $subtract: [
                { $ifNull: ["$totalPayable", 0] },
                EFFECTIVE_PAID_EXPR,
              ],
            },
          ],
        },
        partial: { $eq: ["$paymentStatus", "partial"] },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$due" },
        ordersWithDue: { $sum: { $cond: [{ $gt: ["$due", 0] }, 1, 0] } },
        partialOrders: { $sum: { $cond: ["$partial", 1, 0] } },
      },
    },
  ]);
  return {
    amount: result?.amount || 0,
    ordersWithDue: result?.ordersWithDue || 0,
    partialOrders: result?.partialOrders || 0,
  };
};

const summarizePeriod = async (period: Period) => {
  const [orders, printing] = await Promise.all([
    summarizeOrders(period),
    summarizePrinting(period),
  ]);
  const revenue = orders.revenue + printing.revenue;
  return {
    orders,
    printing,
    revenue,
    profit: revenue - orders.cost,
    salesCount: orders.count + printing.count,
  };
};

const getDashboardStats = async (range: DateRange = "this-month") => {
  const { current, previous } = getPeriods(range);

  const [
    currentSummary,
    previousSummary,
    orderCashCollected,
    receivables,
    orderBreakdown,
    totalUsers,
    currentPeriodUsers,
    previousPeriodUsers,
    totalProducts,
    currentPeriodProducts,
    previousPeriodProducts,
  ] = await Promise.all([
    summarizePeriod(current),
    previous ? summarizePeriod(previous) : Promise.resolve(null),
    sumCashCollectedFromOrders(current),
    sumReceivables(current),
    // Every order placed in the period, whatever its status
    Order.aggregate([
      { $match: { createdAt: inPeriod(current) } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),
    User.countDocuments({ userType: "user" }),
    User.countDocuments({ userType: "user", createdAt: inPeriod(current) }),
    previous
      ? User.countDocuments({
          userType: "user",
          createdAt: inPeriod(previous),
        })
      : Promise.resolve(null),
    Product.countDocuments({ published: true }),
    Product.countDocuments({ published: true, createdAt: inPeriod(current) }),
    previous
      ? Product.countDocuments({
          published: true,
          createdAt: inPeriod(previous),
        })
      : Promise.resolve(null),
  ]);

  const breakdown: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const item of orderBreakdown) {
    if (item._id && breakdown.hasOwnProperty(item._id)) {
      breakdown[item._id] = item.count;
    }
  }

  return {
    totalRevenue: currentSummary.revenue,
    totalProfit: currentSummary.profit,
    totalCost: currentSummary.orders.cost,
    totalOrders: currentSummary.salesCount,
    // All-time shows the whole customer base; a period shows sign-ups in it
    totalCustomers: range === "all-time" ? totalUsers : currentPeriodUsers,
    totalProducts,
    // null = no comparison possible (all-time, or nothing in the previous period)
    revenueGrowth: percentChange(
      currentSummary.revenue,
      previousSummary?.revenue ?? null,
    ),
    profitGrowth: percentChange(
      currentSummary.profit,
      previousSummary?.profit ?? null,
    ),
    ordersGrowth: percentChange(
      currentSummary.salesCount,
      previousSummary?.salesCount ?? null,
    ),
    customersGrowth: percentChange(currentPeriodUsers, previousPeriodUsers),
    // Growth of the catalogue: products added this period vs the last one
    productsGrowth: percentChange(
      currentPeriodProducts,
      previousPeriodProducts,
    ),
    orderBreakdown: breakdown,
    revenueBreakdown: {
      orderRevenue: currentSummary.orders.revenue,
      printingRevenue: currentSummary.printing.revenue,
      orderCount: currentSummary.orders.count,
      printingSalesCount: currentSummary.printing.count,
    },
    cashCollected: orderCashCollected + currentSummary.printing.revenue,
    receivables,
    excludedFees: {
      deliveryFees: currentSummary.orders.deliveryFees,
      additionalCharges: currentSummary.orders.additionalCharges,
    },
    profitWarning: buildProfitWarning(
      currentSummary.orders.itemsWithoutBuyingPrice,
      currentSummary.orders.productsMissingBuyingPrice,
    ),
  };
};

// YYYY-MM-DD of a Bangladesh calendar day
const dhakaDateKey = (date: Date) =>
  new Date(date.getTime() + DHAKA_OFFSET_MS).toISOString().slice(0, 10);

const getSalesData = async (period: string = "30d") => {
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const now = new Date();
  const { year, month, day } = dhakaParts(now);
  // The last `days` calendar days, today included
  const range: Period = {
    start: dhakaStartOf(year, month, day - (days - 1)),
    end: now,
  };
  const dateGroup = {
    $dateToString: {
      format: "%Y-%m-%d",
      date: "$createdAt",
      timezone: MONGO_TIMEZONE,
    },
  };

  const [orderSalesData, printingSalesData] = await Promise.all([
    Order.aggregate([
      { $match: revenueOrderFilter(range) },
      {
        $group: {
          _id: dateGroup,
          sales: { $sum: ORDER_REVENUE_EXPR },
          orders: { $sum: 1 },
        },
      },
    ]),
    PrintingSale.aggregate([
      { $match: paidPrintingFilter(range) },
      {
        $group: {
          _id: dateGroup,
          sales: { $sum: { $ifNull: ["$totalPrice", 0] } },
          orders: { $sum: 1 },
        },
      },
    ]),
  ]);

  const orderByDate = new Map(orderSalesData.map((d) => [d._id, d]));
  const printingByDate = new Map(printingSalesData.map((d) => [d._id, d]));

  // One entry per day, zero-filled, so the chart has no gaps
  return Array.from({ length: days }, (_, index) => {
    const date = dhakaDateKey(
      new Date(range.start.getTime() + index * DAY_MS),
    );
    const orderDay = orderByDate.get(date);
    const printingDay = printingByDate.get(date);
    const orderSales = orderDay?.sales || 0;
    const printingSales = printingDay?.sales || 0;
    return {
      date,
      sales: orderSales + printingSales,
      orders: (orderDay?.orders || 0) + (printingDay?.orders || 0),
      orderSales,
      printingSales,
    };
  });
};

const getRecentOrders = async (limit: number = 5) => {
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

const TOP_PRODUCTS_DAYS = 30;

// Best sellers by units sold over the last 30 days of recognised orders.
// Each item's revenue is its share of the order's revenue after discount.
const getTopProducts = async (limit: number = 5) => {
  const now = new Date();
  const { year, month, day } = dhakaParts(now);
  const range: Period = {
    start: dhakaStartOf(year, month, day - (TOP_PRODUCTS_DAYS - 1)),
    end: now,
  };

  const orders = await Order.find(revenueOrderFilter(range))
    .select("_id subtotal discount")
    .lean();
  if (orders.length === 0) return [];

  const items = await OrderItem.find({
    order: { $in: orders.map((order) => order._id) },
  }).lean();

  const itemSubtotalByOrder = new Map<string, number>();
  for (const item of items) {
    const key = item.order.toString();
    itemSubtotalByOrder.set(
      key,
      (itemSubtotalByOrder.get(key) || 0) + (item.subtotal || 0),
    );
  }
  const revenueRatioByOrder = new Map<string, number>();
  for (const order of orders) {
    const key = order._id.toString();
    const itemSubtotal = itemSubtotalByOrder.get(key) || 0;
    revenueRatioByOrder.set(
      key,
      itemSubtotal > 0 ? orderRevenue(order) / itemSubtotal : 1,
    );
  }

  const totalsByProduct = new Map<string, { sold: number; revenue: number }>();
  for (const item of items) {
    const key = item.product.toString();
    const totals = totalsByProduct.get(key) || { sold: 0, revenue: 0 };
    totals.sold += item.quantity;
    totals.revenue +=
      (item.subtotal || 0) *
      (revenueRatioByOrder.get(item.order.toString()) ?? 1);
    totalsByProduct.set(key, totals);
  }

  const ranked = Array.from(totalsByProduct.entries())
    .sort(([, a], [, b]) => b.sold - a.sold || b.revenue - a.revenue)
    .slice(0, limit);

  const products = await Product.find({
    _id: { $in: ranked.map(([id]) => id) },
  })
    .populate("category", "name")
    .lean();
  const productById = new Map(products.map((p) => [p._id.toString(), p]));

  return ranked.map(([id, totals]) => {
    const product: any = productById.get(id);
    return {
      id,
      name: product?.name || "Deleted product",
      image: product?.mainImage || "/placeholder-product.jpg",
      category: product?.category?.name || "Uncategorized",
      price: product?.price || 0,
      sold: totals.sold,
      revenue: Math.round(totals.revenue * 100) / 100,
      stock: product?.stock || 0,
      periodDays: TOP_PRODUCTS_DAYS,
    };
  });
};

// Revenue and sale count per month (1-12) or year, merged across store
// orders and 3D printing sales.
const revenueBreakdown = async (
  period: Period,
  unit: "$month" | "$year",
  key: "month" | "year",
) => {
  const groupId = { [unit]: { date: "$createdAt", timezone: MONGO_TIMEZONE } };
  const [orderData, printingData] = await Promise.all([
    Order.aggregate([
      { $match: revenueOrderFilter(period) },
      {
        $group: {
          _id: groupId,
          earnings: { $sum: ORDER_REVENUE_EXPR },
          orders: { $sum: 1 },
        },
      },
    ]),
    PrintingSale.aggregate([
      { $match: paidPrintingFilter(period) },
      {
        $group: {
          _id: groupId,
          earnings: { $sum: { $ifNull: ["$totalPrice", 0] } },
          orders: { $sum: 1 },
        },
      },
    ]),
  ]);

  const map = new Map<number, { earnings: number; orders: number }>();
  for (const item of [...orderData, ...printingData]) {
    const existing = map.get(item._id) || { earnings: 0, orders: 0 };
    existing.earnings += item.earnings || 0;
    existing.orders += item.orders || 0;
    map.set(item._id, existing);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([id, data]) => ({ [key]: id, ...data }));
};

const sumRevenue = async (period?: Period) => {
  const [orders, printing] = await Promise.all([
    Order.aggregate([
      { $match: revenueOrderFilter(period) },
      {
        $group: {
          _id: null,
          revenue: { $sum: ORDER_REVENUE_EXPR },
          count: { $sum: 1 },
        },
      },
    ]),
    summarizePrinting(period),
  ]);
  return {
    earnings: (orders[0]?.revenue || 0) + printing.revenue,
    orders: (orders[0]?.count || 0) + printing.count,
  };
};

const getEarningsReport = async () => {
  const now = new Date();
  const { year, month } = dhakaParts(now);

  const yearToDate: Period = { start: dhakaStartOf(year, 0, 1), end: now };
  const monthToDate: Period = { start: dhakaStartOf(year, month, 1), end: now };

  // Same span of last year / last month, for a like-for-like comparison
  const lastYearStart = dhakaStartOf(year - 1, 0, 1);
  const lastYearSamePeriod: Period = {
    start: lastYearStart,
    end: new Date(
      Math.min(
        lastYearStart.getTime() +
          (now.getTime() - yearToDate.start.getTime()),
        yearToDate.start.getTime(),
      ),
    ),
  };
  const lastMonthStart = dhakaStartOf(year, month - 1, 1);
  const lastMonthSamePeriod: Period = {
    start: lastMonthStart,
    end: new Date(
      Math.min(
        lastMonthStart.getTime() +
          (now.getTime() - monthToDate.start.getTime()),
        monthToDate.start.getTime(),
      ),
    ),
  };
  const lastFiveYears: Period = { start: dhakaStartOf(year - 4, 0, 1), end: now };

  const [
    total,
    yearly,
    monthly,
    lastYear,
    lastMonth,
    monthlyBreakdown,
    yearlyBreakdown,
  ] = await Promise.all([
    sumRevenue(),
    sumRevenue(yearToDate),
    sumRevenue(monthToDate),
    sumRevenue(lastYearSamePeriod),
    sumRevenue(lastMonthSamePeriod),
    revenueBreakdown(yearToDate, "$month", "month"),
    revenueBreakdown(lastFiveYears, "$year", "year"),
  ]);

  return {
    total,
    yearly: {
      ...yearly,
      growth: percentChange(yearly.earnings, lastYear.earnings),
      breakdown: yearlyBreakdown,
    },
    monthly: {
      ...monthly,
      growth: percentChange(monthly.earnings, lastMonth.earnings),
      breakdown: monthlyBreakdown,
    },
    avgOrderValue: total.orders > 0 ? total.earnings / total.orders : 0,
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

const getMonthlyProfitBreakdown = async (year?: number) => {
  const targetYear = year || dhakaParts(new Date()).year;
  const yearPeriod: Period = {
    start: dhakaStartOf(targetYear, 0, 1),
    end: dhakaStartOf(targetYear + 1, 0, 1),
  };

  const [orders, printingSales] = await Promise.all([
    Order.find(revenueOrderFilter(yearPeriod)).lean(),
    PrintingSale.find(paidPrintingFilter(yearPeriod)).lean(),
  ]);

  const { items, itemsWithoutBuyingPrice, productsMissingBuyingPrice } =
    await loadOrderItemsWithCost(
      orders.map((order) => order._id as unknown as Types.ObjectId),
    );
  const costByOrder = new Map<string, number>();
  for (const item of items) {
    const key = item.order.toString();
    costByOrder.set(key, (costByOrder.get(key) || 0) + item.cost);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthNames.map((name, index) => ({
    month: index + 1,
    monthName: name,
    orders: 0,
    revenue: 0, // store orders only; printingRevenue is separate
    cost: 0,
    profit: 0, // store + printing revenue − cost
    deliveryFees: 0,
    additionalCharges: 0,
    printingRevenue: 0,
    printingOrders: 0,
  }));

  for (const order of orders) {
    const m = months[dhakaParts(new Date(order.createdAt!)).month];
    m.orders += 1;
    m.revenue += orderRevenue(order);
    m.cost += costByOrder.get(order._id.toString()) || 0;
    m.deliveryFees += order.deliveryCharge || 0;
    m.additionalCharges += order.additionalCharge || 0;
  }

  for (const sale of printingSales) {
    const m = months[dhakaParts(new Date(sale.createdAt!)).month];
    m.printingOrders += 1;
    m.printingRevenue += sale.totalPrice || 0;
  }

  for (const m of months) {
    m.profit = m.revenue + m.printingRevenue - m.cost;
  }

  const totals = months.reduce(
    (acc, m) => ({
      orders: acc.orders + m.orders,
      revenue: acc.revenue + m.revenue,
      cost: acc.cost + m.cost,
      profit: acc.profit + m.profit,
      deliveryFees: acc.deliveryFees + m.deliveryFees,
      additionalCharges: acc.additionalCharges + m.additionalCharges,
      printingRevenue: acc.printingRevenue + m.printingRevenue,
      printingOrders: acc.printingOrders + m.printingOrders,
    }),
    {
      orders: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      deliveryFees: 0,
      additionalCharges: 0,
      printingRevenue: 0,
      printingOrders: 0,
    },
  );

  return {
    year: targetYear,
    months,
    totals,
    profitWarning: buildProfitWarning(
      itemsWithoutBuyingPrice,
      productsMissingBuyingPrice,
    ),
  };
};

const getOrdersWithProfit = async (
  year: number,
  month: number,
  page: number = 1,
  limit: number = 50,
) => {
  const monthPeriod: Period = {
    start: dhakaStartOf(year, month - 1, 1),
    end: dhakaStartOf(year, month, 1),
  };
  const filter = revenueOrderFilter(monthPeriod);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  if (orders.length === 0) {
    return {
      orders: [],
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  const { items } = await loadOrderItemsWithCost(
    orders.map((order) => order._id as unknown as Types.ObjectId),
  );

  const itemsByOrder = new Map<string, any[]>();
  for (const item of items) {
    const key = item.order.toString();
    if (!itemsByOrder.has(key)) {
      itemsByOrder.set(key, []);
    }
    itemsByOrder.get(key)!.push(item);
  }

  const result = orders.map((order) => {
    const orderItems = itemsByOrder.get(order._id.toString()) || [];
    const revenue = orderRevenue(order);

    // Spread the order's discount across its items in proportion to their
    // subtotals, so item revenue adds up to the order revenue.
    const itemSubtotalSum = orderItems.reduce(
      (sum, i) => sum + (i.subtotal || 0),
      0,
    );
    const ratio = itemSubtotalSum > 0 ? revenue / itemSubtotalSum : 1;

    const cost = orderItems.reduce((sum, item) => sum + item.cost, 0);
    const itemDetails = orderItems.map((item: any) => {
      const adjustedSubtotal = (item.subtotal || 0) * ratio;
      return {
        productName: item.productName,
        sellingPrice: (item.productPrice || 0) * ratio,
        buyingPrice: item.resolvedBuyingPrice,
        quantity: item.quantity,
        subtotal: adjustedSubtotal,
        itemProfit: adjustedSubtotal - item.cost,
        selectedColor: item.selectedColor,
      };
    });

    const customerName =
      `${order.firstname || ""} ${order.lastname || ""}`.trim() || "Unknown";

    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName,
      email: order.email,
      phone: order.phone,
      orderDate: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      revenue,
      cost,
      profit: revenue - cost,
      deliveryCharge: order.deliveryCharge || 0,
      additionalCharge: order.additionalCharge || 0,
      discount: order.discount || 0,
      // A "paid" order is settled in full even if amountPaid was never set
      amountPaid:
        order.paymentStatus === "paid"
          ? Math.max(order.totalPayable || 0, order.amountPaid || 0)
          : order.amountPaid || 0,
      totalPayable: order.totalPayable || 0,
      itemCount: orderItems.length,
      items: itemDetails,
    };
  });

  return {
    orders: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const DashboardServices = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
  getEarningsReport,
  getPendingOrdersCount,
  getMonthlyProfitBreakdown,
  getOrdersWithProfit,
};
