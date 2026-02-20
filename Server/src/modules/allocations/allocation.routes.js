import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as allocationController from "./allocation.controller.js";
import {createAllocationSchema, updateAllocationSchema} from "./allocation.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.ALLOCATIONS_READ), allocationController.listAllocations);
router.get(
  "/by-employee",
  requirePermissions(PERMISSIONS.ALLOCATIONS_READ),
  allocationController.listAllocationsByEmployee
);
router.get(
  "/by-project",
  requirePermissions(PERMISSIONS.ALLOCATIONS_READ),
  allocationController.listAllocationsByProject
);
router.post(
  "/",
  requirePermissions(PERMISSIONS.ALLOCATIONS_WRITE),
  validate(createAllocationSchema),
  allocationController.createAllocation
);
router.get("/:id", requirePermissions(PERMISSIONS.ALLOCATIONS_READ), allocationController.getAllocation);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.ALLOCATIONS_WRITE),
  validate(updateAllocationSchema),
  allocationController.updateAllocation
);

export default router;
