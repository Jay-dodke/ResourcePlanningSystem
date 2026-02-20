import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as timesheetService from "./timesheet.service.js";
import * as availabilityService from "../availability/availability.service.js";
import * as auditService from "../audit/audit.service.js";

const isAdminUser = (user) =>
  user?.role?.toLowerCase() === "admin" || user?.permissions?.includes(PERMISSIONS.TIMESHEETS_WRITE);

export const createTimesheet = asyncHandler(async (req, res) => {
  const payload = {...req.validated.body};
  if (!isAdminUser(req.user)) {
    payload.employeeId = req.user?.id;
  }
  const timesheet = await timesheetService.createTimesheet(payload);

  await availabilityService.recalculateAvailability(payload.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "timesheets.create",
    entity: "Timesheet",
    entityId: timesheet._id,
  });

  res.status(201).json({success: true, data: timesheet});
});

export const listTimesheets = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  if (!isAdminUser(req.user)) {
    query.employeeId = req.user?.id;
  }
  const result = await timesheetService.listTimesheets(query);
  res.json({success: true, ...result});
});

export const getTimesheet = asyncHandler(async (req, res) => {
  const timesheet = await timesheetService.getTimesheetById(req.params.id);
  if (!timesheet) throw new ApiError(404, "Timesheet not found");

  if (!isAdminUser(req.user)) {
    const ownerId = timesheet.employeeId?._id?.toString() || timesheet.employeeId?.toString();
    if (ownerId !== String(req.user?.id)) {
      throw new ApiError(403, "Forbidden");
    }
  }

  res.json({success: true, data: timesheet});
});

export const updateTimesheet = asyncHandler(async (req, res) => {
  const updates = {...req.validated.body};
  if (!isAdminUser(req.user)) {
    delete updates.status;
  }

  if (updates.status && updates.status !== "submitted") {
    updates.approvedBy = req.user?.id;
    updates.approvedAt = new Date();
  }

  const timesheet = await timesheetService.updateTimesheet(req.params.id, updates);
  if (!timesheet) throw new ApiError(404, "Timesheet not found");

  await availabilityService.recalculateAvailability(timesheet.employeeId?._id || timesheet.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "timesheets.update",
    entity: "Timesheet",
    entityId: timesheet._id,
  });

  res.json({success: true, data: timesheet});
});

export const deleteTimesheet = asyncHandler(async (req, res) => {
  const timesheet = await timesheetService.deleteTimesheet(req.params.id);
  if (!timesheet) throw new ApiError(404, "Timesheet not found");

  await availabilityService.recalculateAvailability(timesheet.employeeId?._id || timesheet.employeeId);
  await auditService.logAction({
    actorId: req.user?.id,
    action: "timesheets.delete",
    entity: "Timesheet",
    entityId: timesheet._id,
  });

  res.json({success: true, data: timesheet});
});
