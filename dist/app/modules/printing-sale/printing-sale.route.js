"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintingSaleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const printing_sale_controller_1 = require("./printing-sale.controller");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), printing_sale_controller_1.PrintingSaleControllers.createSale);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), printing_sale_controller_1.PrintingSaleControllers.getAllSales);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), printing_sale_controller_1.PrintingSaleControllers.getSingleSale);
router.patch("/:id/payment-status", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), printing_sale_controller_1.PrintingSaleControllers.updatePaymentStatus);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), printing_sale_controller_1.PrintingSaleControllers.deleteSale);
exports.PrintingSaleRoutes = router;
//# sourceMappingURL=printing-sale.route.js.map