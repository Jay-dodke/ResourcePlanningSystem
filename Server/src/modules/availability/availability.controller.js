import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as availabilityService from "./availability.service.js";

export const upsertAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.upsertAvailability(req.validated.body);
  res.status(201).json({success: true, data: availability});
});

export const listAvailability = asyncHandler(async (req, res) => {
  const result = await availabilityService.listAvailability(getQuery(req));
  res.json({success: true, ...result});
});

export const getAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.getAvailabilityById(req.params.id);
  if (!availability) throw new ApiError(404, "Availability not found");
  res.json({success: true, data: availability});
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.updateAvailability(req.params.id, req.validated.body);
  if (!availability) throw new ApiError(404, "Availability not found");
  res.json({success: true, data: availability});
});

export const deleteAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.deleteAvailability(req.params.id);
  if (!availability) throw new ApiError(404, "Availability not found");
  res.json({success: true, data: availability});
});
