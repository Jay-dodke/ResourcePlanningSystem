import Availability from "../availability/availability.model.js";
import Leave from "../leaves/leave.model.js";
import Task from "../tasks/task.model.js";
import {getAllocationTimeline} from "../allocations/allocation.planning.service.js";
import {addWeeks, addDays, startOfWeek, endOfDay} from "../../utils/timeline.js";

const pickEarliestAllocationEnd = (allocations, fromDate) => {
  const upcoming = allocations
    .filter((allocation) => allocation.endDate && allocation.endDate >= fromDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  if (!upcoming.length) return null;
  return {
    date: upcoming[0].endDate,
    project: upcoming[0].projectId || null,
  };
};

export const getPlanningSummary = async ({userId, weeks = 8}) => {
  const now = new Date();
  const rangeFrom = startOfWeek(now);
  const rangeTo = endOfDay(addDays(addWeeks(rangeFrom, weeks), -1));

  const [availability, leaves, upcomingTasks] = await Promise.all([
    Availability.findOne({employeeId: userId}),
    Leave.find({
      employeeId: userId,
      startDate: {$lte: rangeTo},
      endDate: {$gte: rangeFrom},
    })
      .sort("startDate")
      .select("type status startDate endDate reason"),
    Task.find({
      assigneeId: userId,
      status: {$ne: "done"},
      dueDate: {$gte: now},
    })
      .populate("projectId", "name status")
      .sort("dueDate")
      .limit(12),
  ]);

  const timelineResult = await getAllocationTimeline({
    employeeId: userId,
    from: rangeFrom,
    to: rangeTo,
    granularity: "week",
  });

  const allocations = timelineResult.allocations || [];
  const timeline = timelineResult.timeline || [];
  const currentPeriod = timeline.find(
    (period) => now >= period.periodStart && now <= period.periodEnd
  );
  const averageUtilization =
    timeline.length > 0
      ? Math.round(
          timeline.reduce((sum, period) => sum + (period.utilizationPercent || 0), 0) /
            timeline.length
        )
      : 0;

  const conflicts = timeline.filter((period) => period.overload);

  const upcomingAllocationEnd = pickEarliestAllocationEnd(allocations, now);
  const deadlines = upcomingTasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const daysOut = (due - now) / (24 * 60 * 60 * 1000);
    return daysOut <= 14;
  });

  return {
    range: {from: rangeFrom, to: rangeTo, weeks},
    availability: availability || {capacityPercent: 100, availablePercent: 100, workloadStatus: "available"},
    utilization: {
      current: currentPeriod?.utilizationPercent || 0,
      average: averageUtilization,
    },
    allocations,
    timeline,
    conflicts,
    upcomingTasks,
    deadlines,
    leaves,
    upcomingAllocationEnd,
  };
};
