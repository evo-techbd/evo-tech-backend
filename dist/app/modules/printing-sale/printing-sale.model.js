"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintingSale = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const printingSaleItemSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });
const printingSaleSchema = new mongoose_1.Schema({
    saleNumber: {
        type: String,
        unique: true,
        default: () => `PS-${Date.now()}-${(0, uuid_1.v4)().substring(0, 4).toUpperCase()}`,
    },
    customerName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
        default: "Bangladesh",
    },
    notes: {
        type: String,
    },
    items: {
        type: [printingSaleItemSchema],
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: "At least one item is required",
        },
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.PrintingSale = (0, mongoose_1.model)("PrintingSale", printingSaleSchema);
//# sourceMappingURL=printing-sale.model.js.map