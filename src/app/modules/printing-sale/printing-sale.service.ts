import { PrintingSale } from "./printing-sale.model";
import { TPrintingSale } from "./printing-sale.interface";
import { getNextInvoiceSerial } from "../../utils/counter";

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

  if (query.paymentStatus && query.paymentStatus !== "all") {
    filter.paymentStatus = query.paymentStatus;
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
) => {
  const result = await PrintingSale.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true },
  );
  return result;
};

const updateSale = async (id: string, payload: Partial<TPrintingSale>) => {
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

  const result = await PrintingSale.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return result;
};

const deleteSale = async (id: string) => {
  const result = await PrintingSale.findByIdAndDelete(id);
  return result;
};

export const PrintingSaleServices = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSalePaymentStatus,
  updateSale,
  deleteSale,
};
