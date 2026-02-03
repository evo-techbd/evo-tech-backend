"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../utils/catchAsync");
const validateRequest = (schema) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    });
};
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map