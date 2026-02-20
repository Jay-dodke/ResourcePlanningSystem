import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as projectController from "./project.controller.js";
import {createProjectSchema, updateProjectSchema} from "./project.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.PROJECTS_READ), projectController.listProjects);
router.post(
  "/",
  requirePermissions(PERMISSIONS.PROJECTS_WRITE),
  validate(createProjectSchema),
  projectController.createProject
);
router.get("/:id", requirePermissions(PERMISSIONS.PROJECTS_READ), projectController.getProject);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.PROJECTS_WRITE),
  validate(updateProjectSchema),
  projectController.updateProject
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.PROJECTS_WRITE),
  projectController.deleteProject
);

export default router;
