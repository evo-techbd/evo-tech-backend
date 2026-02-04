"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcategory = void 0;
const mongoose_1 = require("mongoose");
const subcategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    image: {
        type: String,
    },
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
exports.Subcategory = (0, mongoose_1.model)("Subcategory", subcategorySchema);
//# sourceMappingURL=subcategory.model.js.map