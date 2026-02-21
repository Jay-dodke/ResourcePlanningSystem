import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requireAdmin, requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as leaveController from "./leave.controller.js";
import {createLeaveSchema, updateLeaveSchema} from "./leave.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.LEAVES_READ), leaveController.listLeaves);
router.post(
  "/",
  requireAdmin,
  requirePermissions(PERMISSIONS.LEAVES_WRITE),
  validate(createLeaveSchema),
  leaveController.createLeave
);
router.get("/:id", requirePermissions(PERMISSIONS.LEAVES_READ), leaveController.getLeave);
router.put(
  "/:id",
  requireAdmin,
  requirePermissions(PERMISSIONS.LEAVES_WRITE),
  validate(updateLeaveSchema),
  leaveController.updateLeave
);
router.delete(
  "/:id",
  requireAdmin,
  requirePermissions(PERMISSIONS.LEAVES_WRITE),
  leaveController.deleteLeave
);

export default router;
