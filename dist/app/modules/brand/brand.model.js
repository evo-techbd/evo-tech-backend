"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    categories: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Category",
        }],
    subcategories: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Subcategory",
        }],
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.Brand = (0, mongoose_1.model)("Brand", brandSchema);
//# sourceMappingURL=brand.model.js.map