import { PrintingSale } from "./printing-sale.model";
import {
  TPrintingSale,
  TPrintingSaleArchiveMonthSummary,
  TPrintingSaleArchiveSummary,
} from "./printing-sale.interface";
import { getNextInvoiceSerial } from "../../utils/counter";
import { PaymentLogServices } from "../payment-log/payment-log.service";

// Sales created before invoice serials existed have none. Give each one the
// next number from the shared order/sale monthly counter for the month it was
// created in, the first time it's loaded. The conditional update means two
// concurrent loads can't overwrite each other's serial.
const ensureInvoiceSerials = async <
  T extends { _id?: unknown; createdAt?: Date; invoiceSerial?: string },
>(
  sales: T[],
): Promise<T[]> => {
  const missing = sales
    .filter((sale) => !sale.invoiceSerial)
    .sort(
      (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
    );

  for (const sale of missing) {
    const serial = await getNextInvoiceSerial(
      sale.createdAt ? new Date(sale.createdAt) : new Date(),
    );
    const updated = await PrintingSale.findOneAndUpdate(
      {
        _id: sale._id,
        $or: [
          { invoiceSerial: { $exists: false } },
          { invoiceSerial: null },
          { invoiceSerial: "" },
        ],
      },
      { $set: { invoiceSerial: serial } },
      { new: true },
    ).lean();
    sale.invoiceSerial = updated
      ? updated.invoiceSerial
      : (await PrintingSale.findById(sale._id).select("invoiceSerial").lean())
          ?.invoiceSerial;
  }

  return sales;
};

const createSale = async (payload: TPrintingSale) => {
  // Recalculate prices server-side for safety
  const items = payload.items.map((item) => ({
    ...item,
    price: item.unitPrice * item.quantity,
  }));
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const result = await PrintingSale.create({
    ...payload,
    items,
    totalPrice,
    invoiceSerial: await getNextInvoiceSerial(),
  });
  await PaymentLogServices.logSalePaymentChange({}, result, {
    event: "created",
    source: "admin",
    performedBy: payload.createdBy,
    note: "Sale created",
  });
  return result;
};

const getAllSales = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = (query.search as string) || "";

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { saleNumber: { $regex: search, $options: "i" } },
      { invoiceSerial: { $regex: search, $options: "i" } },
    ];
  }

  const archiveYear = query.year ? Number(query.year) : undefined;
  const archiveMonth = query.month ? Number(query.month) : undefined;
  const isArchiveView = archiveYear !== undefined && archiveMonth !== undefined;

  if (isArchiveView) {
    // Archive is paid-only by definition — ignore any client-supplied
    // paymentStatus so a stray param can't leak unpaid sales in.
    // Bucketed by the month the sale was CREATED (same month its invoice
    // serial was issued in), not the month it was marked paid.
    filter.paymentStatus = "paid";
    filter.createdAt = {
      $gte: new Date(archiveYear, archiveMonth - 1, 1),
      $lte: new Date(archiveYear, archiveMonth, 0, 23, 59, 59, 999),
    };
  } else if (
    query.paymentStatus &&
    query.paymentStatus !== "all" &&
    query.paymentStatus !== "paid"
  ) {
    filter.paymentStatus = query.paymentStatus;
  } else {
    // Active list default: paid sales now live only in the archive. Covers
    // both "no filter" and a stray ?paymentStatus=paid.
    filter.paymentStatus = { $ne: "paid" };
  }

  const [result, total] = await Promise.all([
    PrintingSale.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "firstName lastName email")
      .lean(),
    PrintingSale.countDocuments(filter),
  ]);

  await ensureInvoiceSerials(result);

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

const getSingleSale = async (id: string) => {
  const result = await PrintingSale.findById(id)
    .populate("createdBy", "firstName lastName email")
    .lean();
  if (result) await ensureInvoiceSerials([result]);
  return result;
};

const updateSalePaymentStatus = async (
  id: string,
  paymentStatus: string,
  performedBy?: string,
) => {
  const before = await PrintingSale.findById(id).lean();
  const result = await PrintingSale.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true },
  );
  if (before && result) {
    await PaymentLogServices.logSalePaymentChange(
      PaymentLogServices.salePaymentSnapshot(before),
      result,
      { source: "admin", performedBy },
    );
  }
  return result;
};

const updateSale = async (
  id: string,
  payload: Partial<TPrintingSale>,
  performedBy?: string,
) => {
  // The invoice serial and sale number are assigned once at creation and
  // must never change, since they are already printed on handed-out invoices.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { invoiceSerial, saleNumber, ...rest } = payload;
  let updateData: Partial<TPrintingSale> = { ...rest };
  
  // Recalculate prices if items are provided
  if (payload.items && payload.items.length > 0) {
    const items = payload.items.map((item) => ({
      ...item,
      price: item.unitPrice * item.quantity,
    }));
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    updateData = { ...updateData, items, totalPrice };
  }

  const before = await PrintingSale.findById(id).lean();
  const result = await PrintingSale.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (before && result) {
    // Logs a status change, or a total edited while the sale is paid.
    await PaymentLogServices.logSalePaymentChange(
      PaymentLogServices.salePaymentSnapshot(before),
      result,
      { source: "admin", performedBy },
    );
  }
  return result;
};

const deleteSale = async (id: string) => {
  const result = await PrintingSale.findByIdAndDelete(id);
  return result;
};

const getArchiveSummary = async (
  year?: number,
): Promise<TPrintingSaleArchiveSummary> => {
  const targetYear = year || new Date().getFullYear();
  const startOfYear = new Date(targetYear, 0, 1);
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  // Bucketed by createdAt — matches getAllSales' archive-view filter above.
  const raw = await PrintingSale.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        saleCount: { $sum: 1 },
        totalAmount: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

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
  const rawByMonth = new Map(raw.map((r) => [r._id, r]));

  const months: TPrintingSaleArchiveMonthSummary[] = monthNames.map(
    (monthName, idx) => {
      const m = rawByMonth.get(idx + 1);
      return {
        month: idx + 1,
        monthName,
        saleCount: m?.saleCount || 0,
        totalAmount: m?.totalAmount || 0,
      };
    },
  );

  const totals = months.reduce(
    (acc, m) => ({
      saleCount: acc.saleCount + m.saleCount,
      totalAmount: acc.totalAmount + m.totalAmount,
    }),
    { saleCount: 0, totalAmount: 0 },
  );

  return { year: targetYear, months, totals };
};

const getArchiveYears = async (): Promise<number[]> => {
  const years = await PrintingSale.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: { $year: "$createdAt" } } },
    { $sort: { _id: -1 } },
  ]);
  return years.map((y) => y._id as number);
};

export const PrintingSaleServices = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSalePaymentStatus,
  updateSale,
  deleteSale,
  getArchiveSummary,
  getArchiveYears,
};
