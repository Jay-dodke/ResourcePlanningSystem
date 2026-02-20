import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as departmentController from "./department.controller.js";
import {createDepartmentSchema, updateDepartmentSchema} from "./department.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.DEPARTMENTS_READ), departmentController.listDepartments);
router.post(
  "/",
  requirePermissions(PERMISSIONS.DEPARTMENTS_WRITE),
  validate(createDepartmentSchema),
  departmentController.createDepartment
);
router.get("/:id", requirePermissions(PERMISSIONS.DEPARTMENTS_READ), departmentController.getDepartment);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.DEPARTMENTS_WRITE),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.DEPARTMENTS_WRITE),
  departmentController.deleteDepartment
);

export default router;
