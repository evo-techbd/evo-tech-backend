"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
faqSchema.index({ isActive: 1, order: 1 });
exports.Faq = (0, mongoose_1.model)("Faq", faqSchema);
//# sourceMappingURL=faq.model.js.map