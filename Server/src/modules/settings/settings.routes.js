import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as settingsController from "./settings.controller.js";
import {updateSettingsSchema} from "./settings.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.SETTINGS_READ), settingsController.getSettings);
router.put(
  "/",
  requirePermissions(PERMISSIONS.SETTINGS_WRITE),
  validate(updateSettingsSchema),
  settingsController.updateSettings
);

export default router;
