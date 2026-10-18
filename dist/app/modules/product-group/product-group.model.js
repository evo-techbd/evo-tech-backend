"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductGroup = void 0;
const mongoose_1 = require("mongoose");
const productGroupMemberSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    label: {
        type: String,
        trim: true,
    },
}, { _id: false });
const productGroupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Group name is required"],
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    members: {
        type: [productGroupMemberSchema],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// A product belongs to at most one group. Validation requires at least two
// members, so no group has an empty array (which would index as null and collide).
productGroupSchema.index({ "members.product": 1 }, { unique: true });
exports.ProductGroup = (0, mongoose_1.model)("ProductGroup", productGroupSchema);
//# sourceMappingURL=product-group.model.js.map