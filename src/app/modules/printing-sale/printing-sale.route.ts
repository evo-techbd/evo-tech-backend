import express from "express";
import auth from "../../middlewares/auth";
import { PrintingSaleControllers } from "./printing-sale.controller";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN), PrintingSaleControllers.createSale);

router.get("/", auth(USER_ROLE.ADMIN), PrintingSaleControllers.getAllSales);

router.get("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.getSingleSale);

router.patch("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.updateSale);

router.patch(
  "/:id/payment-status",
  auth(USER_ROLE.ADMIN),
  PrintingSaleControllers.updatePaymentStatus,
);

router.delete("/:id", auth(USER_ROLE.ADMIN), PrintingSaleControllers.deleteSale);

export const PrintingSaleRoutes = router;
