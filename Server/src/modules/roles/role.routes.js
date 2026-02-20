import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as roleController from "./role.controller.js";
import {createRoleSchema, updateRoleSchema} from "./role.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.ROLES_READ), roleController.listRoles);
router.post(
  "/",
  requirePermissions(PERMISSIONS.ROLES_WRITE),
  validate(createRoleSchema),
  roleController.createRole
);
router.get("/:id", requirePermissions(PERMISSIONS.ROLES_READ), roleController.getRole);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.ROLES_WRITE),
  validate(updateRoleSchema),
  roleController.updateRole
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.ROLES_WRITE),
  roleController.deleteRole
);

export default router;
