import User from "../users/user.model.js";
import Project from "../projects/project.model.js";
import Allocation from "../allocations/allocation.model.js";
import Availability from "../availability/availability.model.js";
import Task from "../tasks/task.model.js";
import Timesheet from "../timesheets/timesheet.model.js";
import Leave from "../leaves/leave.model.js";

export const getAnalyticsSummary = async () => {
  const now = new Date();
  const monthStart = new Date(now);
  monthStart.setDate(now.getDate() - 30);

  const [
    totalEmployees,
    activeProjects,
    totalTasks,
    openTasks,
    availabilityDocs,
    allocationAgg,
    timesheetAgg,
    pendingLeaves,
  ] = await Promise.all([
    User.countDocuments({status: "active"}),
    Project.countDocuments({status: "active"}),
    Task.countDocuments({}),
    Task.countDocuments({status: {$ne: "done"}}),
    Availability.find(),
    Allocation.aggregate([
      {
        $group: {
          _id: "$employeeId",
          totalAllocation: {$sum: "$allocationPercent"},
        },
      },
    ]),
    Timesheet.aggregate([
      {$match: {workDate: {$gte: monthStart, $lte: now}}},
      {
        $group: {
          _id: "$employeeId",
          totalHours: {$sum: "$hours"},
        },
      },
    ]),
    Leave.countDocuments({status: "pending"}),
  ]);

  const availableResources = availabilityDocs.filter((doc) => doc.availablePercent > 0).length;
  const overloadedResources = availabilityDocs.filter((doc) => doc.workloadStatus === "overloaded").length;
  const utilizationRate = availabilityDocs.length
    ? Math.round(
        availabilityDocs.reduce((sum, doc) => sum + (100 - doc.availablePercent), 0) /
          availabilityDocs.length
      )
    : 0;

  const allocationByEmployee = allocationAgg.map((row) => ({
    employeeId: row._id,
    totalAllocation: row.totalAllocation,
  }));

  const hoursByEmployee = timesheetAgg.map((row) => ({
    employeeId: row._id,
    totalHours: row.totalHours,
  }));

  return {
    summary: {
      totalEmployees,
      activeProjects,
      totalTasks,
      openTasks,
      utilizationRate,
      availableResources,
      overloadedResources,
      pendingLeaves,
    },
    allocationByEmployee,
    hoursByEmployee,
  };
};
