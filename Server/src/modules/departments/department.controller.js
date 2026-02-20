import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as departmentService from "./department.service.js";
import * as auditService from "../audit/audit.service.js";

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.validated.body);

  await auditService.logAction({
    actorId: req.user?.id,
    action: "departments.create",
    entity: "Department",
    entityId: department._id,
  });

  res.status(201).json({success: true, data: department});
});

export const listDepartments = asyncHandler(async (req, res) => {
  const result = await departmentService.listDepartments(getQuery(req));
  res.json({success: true, ...result});
});

export const getDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  if (!department) throw new ApiError(404, "Department not found");
  res.json({success: true, data: department});
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.validated.body);
  if (!department) throw new ApiError(404, "Department not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "departments.update",
    entity: "Department",
    entityId: department._id,
  });

  res.json({success: true, data: department});
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.deleteDepartment(req.params.id);
  if (!department) throw new ApiError(404, "Department not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "departments.delete",
    entity: "Department",
    entityId: department._id,
  });

  res.json({success: true, data: department});
});
