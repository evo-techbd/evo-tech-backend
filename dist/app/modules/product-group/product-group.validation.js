"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductGroupValidation = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id");
const memberSchema = zod_1.z.object({
    product: objectId,
    label: zod_1.z.string().trim().max(40, "Label must be 40 characters or less").optional(),
});
const membersSchema = zod_1.z
    .array(memberSchema)
    .min(2, "A group needs at least 2 products")
    .max(12, "A group can have at most 12 products");
const createProductGroupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Group name is required" }).trim().min(1),
        title: zod_1.z.string().trim().max(60).optional(),
        members: membersSchema,
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateProductGroupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1).optional(),
        title: zod_1.z.string().trim().max(60).optional(),
        members: membersSchema.optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.ProductGroupValidation = {
    createProductGroupValidationSchema,
    updateProductGroupValidationSchema,
};
//# sourceMappingURL=product-group.validation.js.map