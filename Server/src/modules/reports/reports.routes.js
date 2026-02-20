import express from "express";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as reportsController from "./reports.controller.js";

const router = express.Router();

router.use(requireAuth);
router.get("/utilization", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.utilizationReport);
router.get("/projects", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.projectReport);
router.get("/utilization.csv", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.allocationsCsv);
router.get("/employees.csv", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.employeesCsv);
router.get("/projects.csv", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.projectsCsv);
router.get("/allocations.csv", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.allocationsExportCsv);
router.get("/tasks.csv", requirePermissions(PERMISSIONS.REPORTS_READ), reportsController.tasksCsv);

export default router;
