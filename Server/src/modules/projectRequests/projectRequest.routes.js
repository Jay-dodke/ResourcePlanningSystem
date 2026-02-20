import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as requestController from "./projectRequest.controller.js";
import {createProjectRequestSchema} from "./projectRequest.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get(
  "/",
  requirePermissions(PERMISSIONS.PROJECT_REQUESTS_READ),
  requestController.listProjectRequests
);
router.get(
  "/my",
  requirePermissions(PERMISSIONS.PROJECT_REQUESTS_READ),
  requestController.listMyProjectRequests
);
router.post(
  "/",
  requirePermissions(PERMISSIONS.PROJECT_REQUESTS_WRITE),
  validate(createProjectRequestSchema),
  requestController.createProjectRequest
);
router.put(
  "/:id/approve",
  requirePermissions(PERMISSIONS.PROJECT_REQUESTS_WRITE),
  requestController.approveProjectRequest
);
router.put(
  "/:id/reject",
  requirePermissions(PERMISSIONS.PROJECT_REQUESTS_WRITE),
  requestController.rejectProjectRequest
);

export default router;
