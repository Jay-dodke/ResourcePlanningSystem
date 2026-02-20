import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as taskController from "./task.controller.js";
import {createTaskSchema, updateTaskSchema} from "./task.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/my", requirePermissions(PERMISSIONS.TASKS_READ), taskController.listMyTasks);
router.get("/", requirePermissions(PERMISSIONS.TASKS_READ), taskController.listTasks);
router.post(
  "/",
  requirePermissions(PERMISSIONS.TASKS_WRITE),
  validate(createTaskSchema),
  taskController.createTask
);
router.get("/:id", requirePermissions(PERMISSIONS.TASKS_READ), taskController.getTask);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.TASKS_READ),
  validate(updateTaskSchema),
  taskController.updateTask
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.TASKS_WRITE),
  taskController.deleteTask
);

export default router;
