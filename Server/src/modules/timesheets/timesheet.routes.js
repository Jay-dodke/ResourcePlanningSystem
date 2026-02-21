import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requireAdmin, requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as timesheetController from "./timesheet.controller.js";
import {createTimesheetSchema, updateTimesheetSchema} from "./timesheet.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.TIMESHEETS_READ), timesheetController.listTimesheets);
router.post(
  "/",
  requireAdmin,
  requirePermissions(PERMISSIONS.TIMESHEETS_WRITE),
  validate(createTimesheetSchema),
  timesheetController.createTimesheet
);
router.get("/:id", requirePermissions(PERMISSIONS.TIMESHEETS_READ), timesheetController.getTimesheet);
router.put(
  "/:id",
  requireAdmin,
  requirePermissions(PERMISSIONS.TIMESHEETS_WRITE),
  validate(updateTimesheetSchema),
  timesheetController.updateTimesheet
);
router.delete(
  "/:id",
  requireAdmin,
  requirePermissions(PERMISSIONS.TIMESHEETS_WRITE),
  timesheetController.deleteTimesheet
);

export default router;
