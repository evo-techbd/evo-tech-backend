"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashRoutes = void 0;
const express_1 = __importDefault(require("express"));
const trash_controller_1 = require("./trash.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get("/stats", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), trash_controller_1.TrashControllers.getTrashStatistics);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), trash_controller_1.TrashControllers.getTrashItems);
router.post("/:id/restore", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), trash_controller_1.TrashControllers.restoreTrashItem);
router.delete("/clear", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), trash_controller_1.TrashControllers.clearTrash);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), trash_controller_1.TrashControllers.permanentlyDeleteTrashItem);
exports.TrashRoutes = router;
//# sourceMappingURL=trash.route.js.map