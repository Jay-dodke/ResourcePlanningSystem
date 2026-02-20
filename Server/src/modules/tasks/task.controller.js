import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as taskService from "./task.service.js";
import * as auditService from "../audit/audit.service.js";

const isAdminUser = (user) =>
  user?.role?.toLowerCase() === "admin" || user?.permissions?.includes(PERMISSIONS.TASKS_WRITE);

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask({...req.validated.body, createdBy: req.user?.id});

  await auditService.logAction({
    actorId: req.user?.id,
    action: "tasks.create",
    entity: "Task",
    entityId: task._id,
  });

  res.status(201).json({success: true, data: task});
});

export const listTasks = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  if (!isAdminUser(req.user)) {
    query.assigneeId = req.user?.id;
  }
  const result = await taskService.listTasks(query);
  res.json({success: true, ...result});
});

export const listMyTasks = asyncHandler(async (req, res) => {
  const query = {...getQuery(req), assigneeId: req.user?.id};
  const result = await taskService.listTasks(query);
  res.json({success: true, ...result});
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  if (!isAdminUser(req.user)) {
    const assigneeId = task.assigneeId?._id?.toString() || task.assigneeId?.toString();
    if (assigneeId && assigneeId !== String(req.user?.id)) {
      throw new ApiError(403, "Forbidden");
    }
  }

  res.json({success: true, data: task});
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!isAdminUser(req.user)) {
    const existing = await taskService.getTaskById(req.params.id);
    if (!existing) throw new ApiError(404, "Task not found");
    const assigneeId = existing.assigneeId?._id?.toString() || existing.assigneeId?.toString();
    if (assigneeId && assigneeId !== String(req.user?.id)) {
      throw new ApiError(403, "Forbidden");
    }

    const updates = {};
    if (req.validated.body.status) {
      updates.status = req.validated.body.status;
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, "Only status updates are allowed");
    }

    const task = await taskService.updateTask(req.params.id, updates);
    await auditService.logAction({
      actorId: req.user?.id,
      action: "tasks.update",
      entity: "Task",
      entityId: task._id,
    });
    return res.json({success: true, data: task});
  }

  const task = await taskService.updateTask(req.params.id, req.validated.body);
  if (!task) throw new ApiError(404, "Task not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "tasks.update",
    entity: "Task",
    entityId: task._id,
  });

  res.json({success: true, data: task});
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.deleteTask(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "tasks.delete",
    entity: "Task",
    entityId: task._id,
  });

  res.json({success: true, data: task});
});
