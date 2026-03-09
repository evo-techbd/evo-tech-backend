import { PrintingSale } from "./printing-sale.model";
import { TPrintingSale } from "./printing-sale.interface";

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

const deleteSale = async (id: string) => {
  const result = await PrintingSale.findByIdAndDelete(id);
  return result;
};

export const PrintingSaleServices = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSalePaymentStatus,
  deleteSale,
};
