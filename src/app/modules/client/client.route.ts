import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ClientValidation } from "./client.validation";
import { ClientController } from "./client.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Public routes
router.get("/active", ClientController.getActiveClients);

// Protected routes (Admin only)
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("logo"),
  validateRequest(ClientValidation.createClientValidationSchema),
  ClientController.createClient
);

router.get("/", auth(USER_ROLE.ADMIN), ClientController.getAllClients);

router.get("/:id", auth(USER_ROLE.ADMIN), ClientController.getSingleClient);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("logo"),
  validateRequest(ClientValidation.updateClientValidationSchema),
  ClientController.updateClient
);

router.delete("/:id", auth(USER_ROLE.ADMIN), ClientController.deleteClient);

router.patch(
  "/:id/toggle-status",
  auth(USER_ROLE.ADMIN),
  ClientController.toggleClientStatus
);

export const ClientRoutes = router;
