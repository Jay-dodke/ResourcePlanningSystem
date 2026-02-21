import Allocation from "./allocation.model.js";
import {getPagination} from "../../utils/pagination.js";
import {ApiError} from "../../utils/apiError.js";
import {detectOverloadDuringRange} from "./allocation.planning.service.js";

const normalizeSegments = (segments = []) =>
  segments
    .map((segment) => ({
      startDate: new Date(segment.startDate),
      endDate: new Date(segment.endDate),
      allocationPercent: Number(segment.allocationPercent),
    }))
    .filter(
      (segment) =>
        !Number.isNaN(segment.startDate.getTime()) &&
        !Number.isNaN(segment.endDate.getTime())
    );

const validateSegments = ({segments = [], startDate, endDate}) => {
  if (!segments.length) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const normalized = normalizeSegments(segments).sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  for (const segment of normalized) {
    if (segment.startDate < start || segment.endDate > end) {
      throw new ApiError(400, "Allocation segments must be within allocation dates");
    }
    if (segment.endDate < segment.startDate) {
      throw new ApiError(400, "Allocation segment endDate must be after startDate");
    }
    if (segment.allocationPercent < 0 || segment.allocationPercent > 100) {
      throw new ApiError(400, "Allocation segment percent must be between 0 and 100");
    }
  }

  for (let i = 1; i < normalized.length; i += 1) {
    if (normalized[i].startDate <= normalized[i - 1].endDate) {
      throw new ApiError(400, "Allocation segments cannot overlap");
    }
  }

  return normalized;
};

const ensureCapacity = async ({
  employeeId,
  startDate,
  endDate,
  allocationPercent,
  segments,
  excludeId,
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const overlapFilter = {
    employeeId,
    _id: excludeId ? {$ne: excludeId} : {$exists: true},
    startDate: {$lte: end},
    endDate: {$gte: start},
  };

  const overlapping = await Allocation.find(overlapFilter);
  const candidate = [
    ...overlapping,
    {
      employeeId,
      startDate: start,
      endDate: end,
      allocationPercent,
      segments,
    },
  ];

  const overloaded = await detectOverloadDuringRange({
    employeeId,
    allocations: candidate,
    from: start,
    to: end,
  });

  if (overloaded) {
    throw new ApiError(409, "Allocation exceeds 100% capacity for this period");
  }
};

export const createAllocation = async (data) => {
  const segments = validateSegments({
    segments: data.segments,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  await ensureCapacity({
    ...data,
    segments,
  });
  return Allocation.create({...data, segments});
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
  const segments = validateSegments({
    segments: data.segments ?? existing.segments,
    startDate,
    endDate,
  });

  await ensureCapacity({
    employeeId: existing.employeeId,
    startDate,
    endDate,
    allocationPercent,
    segments,
    excludeId: id,
  });

  return Allocation.findByIdAndUpdate(id, {...data, segments}, {new: true})
    .populate("employeeId", "name email designation skills avatar")
    .populate("projectId", "name status");
};

export const deleteAllocation = (id) => Allocation.findByIdAndDelete(id);

export const closeAllocation = async (id, closeDate = new Date()) => {
  const allocation = await Allocation.findById(id);
  if (!allocation) return null;

  const resolvedClose = new Date(closeDate);
  if (Number.isNaN(resolvedClose.getTime())) {
    throw new ApiError(400, "Invalid close date");
  }

  const safeEnd = resolvedClose < allocation.startDate ? allocation.startDate : resolvedClose;

  const trimmedSegments = (allocation.segments || [])
    .map((segment) => ({
      startDate: new Date(segment.startDate),
      endDate: new Date(segment.endDate),
      allocationPercent: Number(segment.allocationPercent),
    }))
    .filter((segment) => segment.startDate <= safeEnd)
    .map((segment) => ({
      ...segment,
      endDate: segment.endDate > safeEnd ? safeEnd : segment.endDate,
    }))
    .filter((segment) => segment.endDate >= segment.startDate);

  return Allocation.findByIdAndUpdate(
    id,
    {endDate: safeEnd, segments: trimmedSegments},
    {new: true}
  )
    .populate("employeeId", "name email designation skills avatar")
    .populate("projectId", "name status");
};
