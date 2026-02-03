"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const finance_controller_1 = require("./finance.controller");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post("/transaction", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), finance_controller_1.FinanceControllers.addTransaction);
router.get("/transactions", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), finance_controller_1.FinanceControllers.getAllTransactions);
router.get("/stats", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), finance_controller_1.FinanceControllers.getFinanceStats);
router.get("/sales-profit", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), finance_controller_1.FinanceControllers.getSalesProfitTransactions);
exports.FinanceRoutes = router;
//# sourceMappingURL=finance.route.js.map