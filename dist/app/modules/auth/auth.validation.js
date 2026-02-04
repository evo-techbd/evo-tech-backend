"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.registerValidation = void 0;
const zod_1 = require("zod");
exports.registerValidation = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: "First name is required",
        }).min(1, "First name cannot be empty"),
        lastName: zod_1.z.string({
            required_error: "Last name is required",
        }).min(1, "Last name cannot be empty"),
        email: zod_1.z.string({
            required_error: "Email is required",
        }).email("Invalid email format"),
        password: zod_1.z.string({
            required_error: "Password is required",
        }).min(1, "Password cannot be empty"),
        phone: zod_1.z.string().optional(),
        newsletterOptIn: zod_1.z.boolean().optional(),
    }),
});
exports.loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is required",
        }).email("Invalid email format"),
        password: zod_1.z.string({
            required_error: "Password is required",
        }).min(1, "Password cannot be empty"),
    }),
});
exports.forgotPasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is required",
        }).email("Invalid email format"),
    }),
});
exports.resetPasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({
            required_error: "Reset token is required",
        }).min(1, "Reset token cannot be empty"),
        password: zod_1.z.string({
            required_error: "Password is required",
        }).min(1, "Password cannot be empty"),
    }),
});
exports.AuthValidation = {
    registerValidation: exports.registerValidation,
    loginValidation: exports.loginValidation,
    forgotPasswordValidation: exports.forgotPasswordValidation,
    resetPasswordValidation: exports.resetPasswordValidation,
};
//# sourceMappingURL=auth.validation.js.map