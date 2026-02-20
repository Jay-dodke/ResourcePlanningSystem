import Allocation from "./allocation.model.js";
import {getPagination} from "../../utils/pagination.js";
import {ApiError} from "../../utils/apiError.js";

const ensureCapacity = async ({employeeId, startDate, endDate, allocationPercent, excludeId}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const overlapFilter = {
    employeeId,
    _id: excludeId ? {$ne: excludeId} : {$exists: true},
    startDate: {$lte: end},
    endDate: {$gte: start},
  };

  const overlapping = await Allocation.find(overlapFilter);
  const total = overlapping.reduce((sum, item) => sum + item.allocationPercent, 0);

  if (total + allocationPercent > 100) {
    throw new ApiError(409, "Allocation exceeds 100% capacity for this period");
  }
};

export const createAllocation = async (data) => {
  await ensureCapacity(data);
  return Allocation.create(data);
};

export const listAllocations = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.projectId) filter.projectId = query.projectId;

  const [items, total] = await Promise.all([
    Allocation.find(filter)
      .populate("employeeId", "name email designation skills avatar")
      .populate("projectId", "name status")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Allocation.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getAllocationById = (id) =>
  Allocation.findById(id)
    .populate("employeeId", "name email designation skills avatar")
    .populate("projectId", "name status");

export const updateAllocation = async (id, data) => {
  const existing = await Allocation.findById(id);
  if (!existing) return null;

  const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
  const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
  const allocationPercent = data.allocationPercent ?? existing.allocationPercent;

  await ensureCapacity({
    employeeId: existing.employeeId,
    startDate,
    endDate,
    allocationPercent,
    excludeId: id,
  });

  return Allocation.findByIdAndUpdate(id, data, {new: true})
    .populate("employeeId", "name email designation skills avatar")
    .populate("projectId", "name status");
};

export const deleteAllocation = (id) => Allocation.findByIdAndDelete(id);
