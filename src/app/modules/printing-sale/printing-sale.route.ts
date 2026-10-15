import express from "express";
import auth from "../../middlewares/auth";
import { PrintingSaleControllers } from "./printing-sale.controller";
import { USER_ROLE } from "../user/user.constant";
import { PaymentLogControllers } from "../payment-log/payment-log.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN), PrintingSaleControllers.createSale);

router.get("/", auth(USER_ROLE.ADMIN), PrintingSaleControllers.getAllSales);

// Must be registered before "/:id" so "archive" isn't treated as a sale id.
router.get(
  "/archive/summary",
  auth(USER_ROLE.ADMIN),
  PrintingSaleControllers.getArchiveSummary,
);

router.get(
  "/archive/years",
  auth(USER_ROLE.ADMIN),
  PrintingSaleControllers.getArchiveYears,
);

router.get("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.getSingleSale);

router.get(
  "/:id/payment-logs",
  auth(USER_ROLE.ADMIN),
  PaymentLogControllers.getPrintingSalePaymentLogs,
);

router.patch("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.updateSale);

router.patch(
  "/:id/payment-status",
  auth(USER_ROLE.ADMIN),
  PrintingSaleControllers.updatePaymentStatus,
);

router.delete("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.deleteSale);

export const PrintingSaleRoutes = router;
