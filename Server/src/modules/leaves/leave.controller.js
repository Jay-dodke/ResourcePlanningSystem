import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as leaveService from "./leave.service.js";
import * as availabilityService from "../availability/availability.service.js";
import * as auditService from "../audit/audit.service.js";

const isAdminUser = (user) =>
  user?.role?.toLowerCase() === "admin" || user?.permissions?.includes(PERMISSIONS.LEAVES_WRITE);

export const createLeave = asyncHandler(async (req, res) => {
  const payload = {...req.validated.body};
  if (!isAdminUser(req.user)) {
    payload.employeeId = req.user?.id;
  }
  const leave = await leaveService.createLeave(payload);

  await availabilityService.recalculateAvailability(payload.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "leaves.create",
    entity: "Leave",
    entityId: leave._id,
  });

  res.status(201).json({success: true, data: leave});
});

export const listLeaves = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  if (!isAdminUser(req.user)) {
    query.employeeId = req.user?.id;
  }
  const result = await leaveService.listLeaves(query);
  res.json({success: true, ...result});
});

export const getLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.getLeaveById(req.params.id);
  if (!leave) throw new ApiError(404, "Leave not found");

  if (!isAdminUser(req.user)) {
    const ownerId = leave.employeeId?._id?.toString() || leave.employeeId?.toString();
    if (ownerId !== String(req.user?.id)) {
      throw new ApiError(403, "Forbidden");
    }
  }

  res.json({success: true, data: leave});
});

export const updateLeave = asyncHandler(async (req, res) => {
  const updates = {...req.validated.body};
  if (!isAdminUser(req.user)) {
    delete updates.status;
  }

  if (updates.status && updates.status !== "pending") {
    updates.approvedBy = req.user?.id;
    updates.decisionAt = new Date();
  }

  const leave = await leaveService.updateLeave(req.params.id, updates);
  if (!leave) throw new ApiError(404, "Leave not found");

  await availabilityService.recalculateAvailability(leave.employeeId?._id || leave.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "leaves.update",
    entity: "Leave",
    entityId: leave._id,
  });

  res.json({success: true, data: leave});
});

export const deleteLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.deleteLeave(req.params.id);
  if (!leave) throw new ApiError(404, "Leave not found");

  await availabilityService.recalculateAvailability(leave.employeeId?._id || leave.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "leaves.delete",
    entity: "Leave",
    entityId: leave._id,
  });

  res.json({success: true, data: leave});
});
