import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as projectService from "./project.service.js";
import * as auditService from "../audit/audit.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject({
    ...req.validated.body,
    createdBy: req.user?.id,
  });

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projects.create",
    entity: "Project",
    entityId: project._id,
  });

  res.status(201).json({success: true, data: project});
});

export const listProjects = asyncHandler(async (req, res) => {
  const result = await projectService.listProjects(getQuery(req));
  res.json({success: true, ...result});
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  res.json({success: true, data: project});
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.validated.body);
  if (!project) throw new ApiError(404, "Project not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projects.update",
    entity: "Project",
    entityId: project._id,
  });

  res.json({success: true, data: project});
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.deleteProject(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projects.delete",
    entity: "Project",
    entityId: project._id,
  });

  res.json({success: true, data: project});
});
