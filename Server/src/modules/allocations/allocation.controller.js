import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as allocationService from "./allocation.service.js";
import * as availabilityService from "../availability/availability.service.js";
import * as auditService from "../audit/audit.service.js";

export const createAllocation = asyncHandler(async (req, res) => {
  const allocation = await allocationService.createAllocation(req.validated.body);

  await availabilityService.recalculateAvailability(
    allocation.employeeId?._id || allocation.employeeId
  );

  await auditService.logAction({
    actorId: req.user?.id,
    action: "allocations.create",
    entity: "Allocation",
    entityId: allocation._id,
  });

  res.status(201).json({success: true, data: allocation});
});

export const listAllocations = asyncHandler(async (req, res) => {
  const result = await allocationService.listAllocations(getQuery(req));
  res.json({success: true, ...result});
});

export const listAllocationsByEmployee = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  if (!query.employeeId) throw new ApiError(400, "employeeId is required");
  const result = await allocationService.listAllocations({
    ...query,
    employeeId: query.employeeId,
  });
  res.json({success: true, ...result});
});

export const listAllocationsByProject = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  if (!query.projectId) throw new ApiError(400, "projectId is required");
  const result = await allocationService.listAllocations({
    ...query,
    projectId: query.projectId,
  });
  res.json({success: true, ...result});
});

export const getAllocation = asyncHandler(async (req, res) => {
  const allocation = await allocationService.getAllocationById(req.params.id);
  if (!allocation) throw new ApiError(404, "Allocation not found");
  res.json({success: true, data: allocation});
});

export const updateAllocation = asyncHandler(async (req, res) => {
  const allocation = await allocationService.updateAllocation(req.params.id, req.validated.body);
  if (!allocation) throw new ApiError(404, "Allocation not found");

  await availabilityService.recalculateAvailability(
    allocation.employeeId?._id || allocation.employeeId
  );

  await auditService.logAction({
    actorId: req.user?.id,
    action: "allocations.update",
    entity: "Allocation",
    entityId: allocation._id,
  });

  res.json({success: true, data: allocation});
});

export const deleteAllocation = asyncHandler(async (req, res) => {
  const allocation = await allocationService.deleteAllocation(req.params.id);
  if (!allocation) throw new ApiError(404, "Allocation not found");

  await availabilityService.recalculateAvailability(
    allocation.employeeId?._id || allocation.employeeId
  );

  await auditService.logAction({
    actorId: req.user?.id,
    action: "allocations.delete",
    entity: "Allocation",
    entityId: allocation._id,
  });

  res.json({success: true, data: allocation});
});
