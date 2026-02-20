import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as requestService from "./projectRequest.service.js";
import * as availabilityService from "../availability/availability.service.js";
import * as allocationService from "../allocations/allocation.service.js";
import * as notificationService from "../notifications/notification.service.js";
import * as auditService from "../audit/audit.service.js";

const isAdmin = (user) => user?.role?.toLowerCase() === "admin";

export const createProjectRequest = asyncHandler(async (req, res) => {
  const {projectId, allocationId, reason} = req.validated.body;

  const request = await requestService.createProjectRequest({
    employeeId: req.user?.id,
    projectId,
    allocationId,
    reason,
  });

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projectRequests.create",
    entity: "ProjectRequest",
    entityId: request._id,
  });

  res.status(201).json({success: true, data: request});
});

export const listProjectRequests = asyncHandler(async (req, res) => {
  if (!isAdmin(req.user)) throw new ApiError(403, "Forbidden");
  const result = await requestService.listProjectRequests(getQuery(req));
  res.json({success: true, ...result});
});

export const listMyProjectRequests = asyncHandler(async (req, res) => {
  const result = await requestService.listProjectRequests({
    ...getQuery(req),
    employeeId: req.user?.id,
  });
  res.json({success: true, ...result});
});

export const approveProjectRequest = asyncHandler(async (req, res) => {
  if (!isAdmin(req.user)) throw new ApiError(403, "Forbidden");
  const request = await requestService.getProjectRequestById(req.params.id);
  if (!request) throw new ApiError(404, "Request not found");
  if (request.status !== "pending") throw new ApiError(409, "Request already processed");

  await requestService.updateProjectRequest(req.params.id, {
    status: "approved",
    reviewedBy: req.user?.id,
    reviewedAt: new Date(),
  });

  if (request.allocationId) {
    await allocationService.deleteAllocation(request.allocationId);
  }

  await availabilityService.recalculateAvailability(request.employeeId?._id || request.employeeId);

  await notificationService.createNotification({
    userId: request.employeeId?._id || request.employeeId,
    title: "Project leave approved",
    message: `Your request to leave ${request.projectId?.name || "the project"} was approved.`,
    type: "success",
    read: false,
  });

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projectRequests.approve",
    entity: "ProjectRequest",
    entityId: request._id,
  });

  res.json({success: true, message: "Request approved"});
});

export const rejectProjectRequest = asyncHandler(async (req, res) => {
  if (!isAdmin(req.user)) throw new ApiError(403, "Forbidden");
  const request = await requestService.getProjectRequestById(req.params.id);
  if (!request) throw new ApiError(404, "Request not found");
  if (request.status !== "pending") throw new ApiError(409, "Request already processed");

  await requestService.updateProjectRequest(req.params.id, {
    status: "rejected",
    reviewedBy: req.user?.id,
    reviewedAt: new Date(),
  });

  await notificationService.createNotification({
    userId: request.employeeId?._id || request.employeeId,
    title: "Project leave rejected",
    message: `Your request to leave ${request.projectId?.name || "the project"} was rejected.`,
    type: "warning",
    read: false,
  });

  await auditService.logAction({
    actorId: req.user?.id,
    action: "projectRequests.reject",
    entity: "ProjectRequest",
    entityId: request._id,
  });

  res.json({success: true, message: "Request rejected"});
});
