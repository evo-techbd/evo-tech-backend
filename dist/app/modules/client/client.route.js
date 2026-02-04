"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_validation_1 = require("./client.validation");
const client_controller_1 = require("./client.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Public routes
router.get("/active", client_controller_1.ClientController.getActiveClients);
// Protected routes (Admin only)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("logo"), (0, validateRequest_1.default)(client_validation_1.ClientValidation.createClientValidationSchema), client_controller_1.ClientController.createClient);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), client_controller_1.ClientController.getAllClients);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), client_controller_1.ClientController.getSingleClient);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("logo"), (0, validateRequest_1.default)(client_validation_1.ClientValidation.updateClientValidationSchema), client_controller_1.ClientController.updateClient);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), client_controller_1.ClientController.deleteClient);
router.patch("/:id/toggle-status", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), client_controller_1.ClientController.toggleClientStatus);
exports.ClientRoutes = router;
//# sourceMappingURL=client.route.js.map