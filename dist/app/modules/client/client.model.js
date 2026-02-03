"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
    },
    logo: {
        type: String,
        required: [true, "Client logo is required"],
    },
    website: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    sortOrder: {
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
// Index for efficient sorting and filtering
clientSchema.index({ sortOrder: 1, isActive: 1 });
exports.Client = (0, mongoose_1.model)("Client", clientSchema);
//# sourceMappingURL=client.model.js.map