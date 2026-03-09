import express from "express";
import { TrashControllers } from "./trash.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get("/stats", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), TrashControllers.getTrashStatistics);
router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), TrashControllers.getTrashItems);
router.post("/:id/restore", auth(USER_ROLE.ADMIN), TrashControllers.restoreTrashItem);
router.delete("/clear", auth(USER_ROLE.ADMIN), TrashControllers.clearTrash);
router.delete("/:id", auth(USER_ROLE.ADMIN), TrashControllers.permanentlyDeleteTrashItem);

export const TrashRoutes = router;
