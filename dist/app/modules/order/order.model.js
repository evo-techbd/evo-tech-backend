"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = exports.Order = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const orderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        unique: true,
        default: () => `ORD-${Date.now()}-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`,
    },
    user: {
        type: String,
        required: false, // Optional for guest orders
    },
    guestEmail: {
        type: String,
        required: false, // Store guest email for linking later
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: false,
        default: "",
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    houseStreet: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    subdistrict: {
        type: String,
    },
    postcode: {
        type: String,
        required: false,
        default: "",
    },
    country: {
        type: String,
        required: true,
        default: "Bangladesh",
    },
    shippingType: {
        type: String,
        required: true,
    },
    pickupPointId: {
        type: String,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
    },
    bkashTransactionId: {
        type: String,
    },
    bkashPaymentID: {
        type: String,
    },
    terms: {
        type: Boolean,
        required: true,
        default: false,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    additionalCharge: {
        type: Number,
        default: 0,
    },
    totalPayable: {
        type: Number,
        required: true,
    },
    amountPaid: {
        type: Number,
        default: 0,
    },
    amountDue: {
        type: Number,
        default: 0,
    },
    isPreOrderOrder: {
        type: Boolean,
        default: false,
    },
    preOrderItemsCount: {
        type: Number,
        default: 0,
    },
    depositDue: {
        type: Number,
        default: 0,
    },
    depositPaid: {
        type: Number,
        default: 0,
    },
    depositStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    balanceDue: {
        type: Number,
        default: 0,
    },
    balancePaid: {
        type: Number,
        default: 0,
    },
    balanceStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "partial", "paid", "failed", "refunded"],
        default: "pending",
    },
    notes: {
        type: String,
    },
    trackingCode: {
        type: String,
    },
    viewed: {
        type: Boolean,
        default: false,
    },
    unpaidNotified: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
const orderItemSchema = new mongoose_1.Schema({
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    selectedColor: {
        type: String,
    },
    subtotal: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
exports.OrderItem = (0, mongoose_1.model)("OrderItem", orderItemSchema);
//# sourceMappingURL=order.model.js.map