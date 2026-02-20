import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as availabilityController from "./availability.controller.js";
import {upsertAvailabilitySchema, updateAvailabilitySchema} from "./availability.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.AVAILABILITY_READ), availabilityController.listAvailability);
router.post(
  "/",
  requirePermissions(PERMISSIONS.AVAILABILITY_WRITE),
  validate(upsertAvailabilitySchema),
  availabilityController.upsertAvailability
);
router.get("/:id", requirePermissions(PERMISSIONS.AVAILABILITY_READ), availabilityController.getAvailability);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.AVAILABILITY_WRITE),
  validate(updateAvailabilitySchema),
  availabilityController.updateAvailability
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.AVAILABILITY_WRITE),
  availabilityController.deleteAvailability
);

export default router;
