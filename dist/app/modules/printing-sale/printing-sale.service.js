"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintingSaleServices = void 0;
const printing_sale_model_1 = require("./printing-sale.model");
const createSale = async (payload) => {
    // Recalculate prices server-side for safety
    const items = payload.items.map((item) => ({
        ...item,
        price: item.unitPrice * item.quantity,
    }));
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const result = await printing_sale_model_1.PrintingSale.create({
        ...payload,
        items,
        totalPrice,
    });
    return result;
};
const getAllSales = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || "";
    const filter = {};
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
        printing_sale_model_1.PrintingSale.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "firstName lastName email")
            .lean(),
        printing_sale_model_1.PrintingSale.countDocuments(filter),
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
const getSingleSale = async (id) => {
    const result = await printing_sale_model_1.PrintingSale.findById(id)
        .populate("createdBy", "firstName lastName email")
        .lean();
    return result;
};
const updateSalePaymentStatus = async (id, paymentStatus) => {
    const result = await printing_sale_model_1.PrintingSale.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    return result;
};
const deleteSale = async (id) => {
    const result = await printing_sale_model_1.PrintingSale.findByIdAndDelete(id);
    return result;
};
exports.PrintingSaleServices = {
    createSale,
    getAllSales,
    getSingleSale,
    updateSalePaymentStatus,
    deleteSale,
};
//# sourceMappingURL=printing-sale.service.js.map