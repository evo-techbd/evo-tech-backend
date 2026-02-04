import express from "express";
import auth from "../../middlewares/auth";
import { FinanceControllers } from "./finance.controller";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/transaction",
  auth(USER_ROLE.ADMIN),
  FinanceControllers.addTransaction
);

router.get(
  "/transactions",
  auth(USER_ROLE.ADMIN),
  FinanceControllers.getAllTransactions
);

router.get(
  "/stats",
  auth(USER_ROLE.ADMIN),
  FinanceControllers.getFinanceStats
);

router.get(
  "/sales-profit",
  auth(USER_ROLE.ADMIN),
  FinanceControllers.getSalesProfitTransactions
);

export const FinanceRoutes = router;
