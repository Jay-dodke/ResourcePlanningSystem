import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as roleService from "./role.service.js";

export const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.validated.body);
  res.status(201).json({success: true, data: role});
});

export const listRoles = asyncHandler(async (req, res) => {
  const result = await roleService.listRoles(getQuery(req));
  res.json({success: true, ...result});
});

export const getRole = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  res.json({success: true, data: role});
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.validated.body);
  if (!role) throw new ApiError(404, "Role not found");
  res.json({success: true, data: role});
});

export const deleteRole = asyncHandler(async (req, res) => {
  const role = await roleService.deleteRole(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  res.json({success: true, data: role});
});
