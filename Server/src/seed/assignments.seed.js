import Allocation from "../modules/allocations/allocation.model.js";
import Availability from "../modules/availability/availability.model.js";
import Notification from "../modules/notifications/notification.model.js";
import Settings from "../modules/settings/settings.model.js";
import Task from "../modules/tasks/task.model.js";
import Timesheet from "../modules/timesheets/timesheet.model.js";
import Leave from "../modules/leaves/leave.model.js";

export const seedAssignments = async ({adminUser, employees = [], projects = []} = {}) => {
  await Settings.findOneAndUpdate(
    {},
    {
      companyName: "Leometric RPS",
      workHoursPerDay: 8,
      timezone: "America/New_York",
      currency: "USD",
      logo: "",
    },
    {upsert: true, new: true}
  );

  if (!adminUser || employees.length === 0 || projects.length === 0) {
    return;
  }

  const assignmentCount = Number(process.env.SEED_ASSIGNMENT_EMPLOYEE_COUNT || "3");
  const assignmentEmployees = assignmentCount > 0 ? employees.slice(0, assignmentCount) : [];
  if (assignmentEmployees.length === 0) {
    return;
  }

  const now = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 2);
  const anchorProject = projects[0];

  for (const employee of assignmentEmployees) {
    await Allocation.findOneAndUpdate(
      {employeeId: employee._id, projectId: anchorProject._id},
      {
        employeeId: employee._id,
        projectId: anchorProject._id,
        role: "Contributor",
        allocationPercent: 40,
        billable: true,
        startDate: now,
        endDate: future,
      },
      {upsert: true, new: true}
    );

    await Availability.findOneAndUpdate(
      {employeeId: employee._id},
      {employeeId: employee._id, capacityPercent: 100, availablePercent: 60, workloadStatus: "partial"},
      {upsert: true, new: true}
    );

    await Notification.findOneAndUpdate(
      {userId: employee._id, title: "New assignment"},
      {
        userId: employee._id,
        title: "New assignment",
        message: "You have been assigned to Atlas Revamp.",
        type: "info",
        read: false,
      },
      {upsert: true, new: true}
    );

    const task = await Task.findOneAndUpdate(
      {title: `Kickoff plan - ${employee.name}`, projectId: anchorProject._id},
      {
        title: `Kickoff plan - ${employee.name}`,
        description: "Prepare kickoff checklist and initial task breakdown.",
        priority: "high",
        status: "in-progress",
        startDate: now,
        dueDate: future,
        projectId: anchorProject._id,
        assigneeId: employee._id,
        createdBy: adminUser._id,
      },
      {upsert: true, new: true}
    );

    await Timesheet.findOneAndUpdate(
      {employeeId: employee._id, taskId: task._id, workDate: now},
      {
        employeeId: employee._id,
        projectId: anchorProject._id,
        taskId: task._id,
        workDate: now,
        hours: 6,
        notes: "Initial planning session",
        status: "submitted",
      },
      {upsert: true, new: true}
    );
  }

  if (assignmentEmployees[0]) {
    await Leave.findOneAndUpdate(
      {employeeId: assignmentEmployees[0]._id, status: "pending"},
      {
        employeeId: assignmentEmployees[0]._id,
        type: "annual",
        startDate: now,
        endDate: future,
        reason: "Scheduled PTO",
        status: "pending",
      },
      {upsert: true, new: true}
    );
  }
};
