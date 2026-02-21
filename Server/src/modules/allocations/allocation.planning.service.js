import Allocation from "./allocation.model.js";
import Availability from "../availability/availability.model.js";
import {
  buildPeriods,
  getOverlapMs,
  getPeriodDays,
  startOfDay,
  endOfDay,
  toDate,
  addWeeks,
  addDays,
} from "../../utils/timeline.js";

const roundPercent = (value) => Math.round(value * 10) / 10;

const normalizeSegments = (allocation) => {
  const segments = Array.isArray(allocation.segments) ? allocation.segments : [];
  if (segments.length === 0) {
    return [
      {
        startDate: allocation.startDate,
        endDate: allocation.endDate,
        allocationPercent: allocation.allocationPercent,
      },
    ];
  }
  return segments.map((segment) => ({
    startDate: segment.startDate,
    endDate: segment.endDate,
    allocationPercent: segment.allocationPercent,
  }));
};

const computeTimelineTotals = ({allocations, from, to, granularity, capacityPercent}) => {
  const periods = buildPeriods({from, to, granularity});
  const timeline = periods.map((period) => ({
    periodStart: period.start,
    periodEnd: period.end,
    label: period.label,
    totalAllocation: 0,
  }));

  allocations.forEach((allocation) => {
    const segments = normalizeSegments(allocation);
    segments.forEach((segment) => {
      const segmentStart = startOfDay(segment.startDate);
      const segmentEnd = endOfDay(segment.endDate);
      timeline.forEach((period) => {
        const overlapMs = getOverlapMs(segmentStart, segmentEnd, period.periodStart, period.periodEnd);
        if (!overlapMs) return;
        const periodDays = getPeriodDays({
          start: period.periodStart,
          end: period.periodEnd,
        });
        const overlapDays = overlapMs / (24 * 60 * 60 * 1000);
        const ratio = Math.min(1, overlapDays / periodDays);
        period.totalAllocation += segment.allocationPercent * ratio;
      });
    });
  });

  return timeline.map((period) => {
    const utilizationPercent = capacityPercent
      ? roundPercent((period.totalAllocation / capacityPercent) * 100)
      : 0;
    const totalAllocation = roundPercent(period.totalAllocation);
    return {
      ...period,
      totalAllocation,
      capacityPercent,
      utilizationPercent,
      overload: totalAllocation > capacityPercent,
    };
  });
};

export const getAllocationTimeline = async ({
  employeeId,
  projectId,
  from,
  to,
  granularity = "week",
}) => {
  const rangeFrom = toDate(from, startOfDay(new Date()));
  const rangeTo = toDate(to, endOfDay(addDays(addWeeks(rangeFrom, 8), -1)));
  const filter = {
    startDate: {$lte: rangeTo},
    endDate: {$gte: rangeFrom},
  };
  if (employeeId) filter.employeeId = employeeId;
  if (projectId) filter.projectId = projectId;

  const allocations = await Allocation.find(filter)
    .populate("employeeId", "name email designation avatar")
    .populate("projectId", "name status");

  let capacityPercent = 100;
  if (employeeId) {
    const availability = await Availability.findOne({employeeId}).select("capacityPercent");
    capacityPercent = availability?.capacityPercent ?? 100;
  }

  const timeline = computeTimelineTotals({
    allocations,
    from: rangeFrom,
    to: rangeTo,
    granularity,
    capacityPercent,
  });

  return {allocations, timeline, from: rangeFrom, to: rangeTo, granularity};
};

export const getFutureAllocations = async ({
  employeeId,
  projectId,
  from,
  to,
  limit = 50,
}) => {
  const rangeFrom = toDate(from, startOfDay(new Date()));
  const rangeTo = toDate(to, endOfDay(addDays(addWeeks(rangeFrom, 12), -1)));

  const filter = {
    startDate: {$gte: rangeFrom, $lte: rangeTo},
  };
  if (employeeId) filter.employeeId = employeeId;
  if (projectId) filter.projectId = projectId;

  return Allocation.find(filter)
    .populate("employeeId", "name email designation avatar")
    .populate("projectId", "name status")
    .sort("startDate")
    .limit(limit);
};

export const getAllocationConflicts = async ({
  employeeId,
  from,
  to,
  granularity = "week",
}) => {
  const rangeFrom = toDate(from, startOfDay(new Date()));
  const rangeTo = toDate(to, endOfDay(addDays(addWeeks(rangeFrom, 8), -1)));

  const filter = {
    startDate: {$lte: rangeTo},
    endDate: {$gte: rangeFrom},
  };
  if (employeeId) filter.employeeId = employeeId;

  const allocations = await Allocation.find(filter)
    .populate("employeeId", "name email designation avatar")
    .populate("projectId", "name status");

  const allocationsByEmployee = new Map();
  allocations.forEach((allocation) => {
    const key = allocation.employeeId?._id?.toString() || allocation.employeeId?.toString();
    if (!key) return;
    if (!allocationsByEmployee.has(key)) {
      allocationsByEmployee.set(key, []);
    }
    allocationsByEmployee.get(key).push(allocation);
  });

  const employeeIds = Array.from(allocationsByEmployee.keys());
  const availabilityDocs = await Availability.find({employeeId: {$in: employeeIds}}).select(
    "employeeId capacityPercent"
  );
  const capacityMap = new Map(
    availabilityDocs.map((doc) => [doc.employeeId.toString(), doc.capacityPercent ?? 100])
  );

  const conflicts = [];
  allocationsByEmployee.forEach((items, id) => {
    const capacityPercent = capacityMap.get(id) ?? 100;
    const timeline = computeTimelineTotals({
      allocations: items,
      from: rangeFrom,
      to: rangeTo,
      granularity,
      capacityPercent,
    });
    timeline
      .filter((period) => period.overload)
      .forEach((period) => {
        conflicts.push({
          employeeId: id,
          employee: items[0]?.employeeId || null,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
          totalAllocation: period.totalAllocation,
          capacityPercent,
          utilizationPercent: period.utilizationPercent,
        });
      });
  });

  return {conflicts, from: rangeFrom, to: rangeTo, granularity};
};

export const detectOverloadDuringRange = async ({
  employeeId,
  allocations,
  from,
  to,
}) => {
  const rangeFrom = toDate(from, startOfDay(new Date()));
  const rangeTo = toDate(to, endOfDay(addDays(addWeeks(rangeFrom, 8), -1)));
  let capacityPercent = 100;
  if (employeeId) {
    const availability = await Availability.findOne({employeeId}).select("capacityPercent");
    capacityPercent = availability?.capacityPercent ?? 100;
  }
  const timeline = computeTimelineTotals({
    allocations,
    from: rangeFrom,
    to: rangeTo,
    granularity: "day",
    capacityPercent,
  });

  return timeline.some((period) => period.overload);
};
