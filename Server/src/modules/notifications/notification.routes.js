import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as notificationController from "./notification.controller.js";
import {createNotificationSchema, updateNotificationSchema} from "./notification.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.NOTIFICATIONS_READ), notificationController.listNotifications);
router.post(
  "/",
  requirePermissions(PERMISSIONS.NOTIFICATIONS_WRITE),
  validate(createNotificationSchema),
  notificationController.createNotification
);
router.get("/:id", requirePermissions(PERMISSIONS.NOTIFICATIONS_READ), notificationController.getNotification);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.NOTIFICATIONS_READ),
  validate(updateNotificationSchema),
  notificationController.updateNotification
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.NOTIFICATIONS_WRITE),
  notificationController.deleteNotification
);

export default router;
