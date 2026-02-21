import express from "express";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as planningController from "./planning.controller.js";

const router = express.Router();

router.use(requireAuth);
router.get(
  "/planning-summary",
  requirePermissions(PERMISSIONS.DASHBOARD_READ),
  planningController.getPlanningSummary
);

export default router;
