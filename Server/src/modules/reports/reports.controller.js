import {Parser} from "json2csv";
import {asyncHandler} from "../../utils/asyncHandler.js";
import * as reportsService from "./reports.service.js";

export const utilizationReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getUtilization();
  res.json({success: true, data});
});

export const projectReport = asyncHandler(async (req, res) => {
  const data = await reportsService.getProjectUtilization();
  res.json({success: true, data});
});

export const allocationsCsv = asyncHandler(async (req, res) => {
  const data = await reportsService.getUtilization();
  const rows = data.map((row) => ({
    employeeName: row.employee?.name || "",
    employeeEmail: row.employee?.email || "",
    totalAllocation: row.totalAllocation,
    assignments: row.assignments,
  }));
  const parser = new Parser({
    fields: ["employeeName", "employeeEmail", "totalAllocation", "assignments"],
  });
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("utilization-report.csv");
  res.send(csv);
});

export const employeesCsv = asyncHandler(async (req, res) => {
  const data = await reportsService.getEmployees();
  const rows = data.map((row) => ({
    name: row.name,
    email: row.email,
    role: row.roleId?.name || "",
    department: row.departmentId?.name || "",
    designation: row.designation || "",
    status: row.status || "",
  }));
  const parser = new Parser({
    fields: ["name", "email", "role", "department", "designation", "status"],
  });
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("employees.csv");
  res.send(csv);
});

export const projectsCsv = asyncHandler(async (req, res) => {
  const data = await reportsService.getProjects();
  const rows = data.map((row) => ({
    name: row.name,
    clientName: row.clientName,
    status: row.status,
    priority: row.priority,
    manager: row.managerId?.name || "",
    startDate: row.startDate,
    endDate: row.endDate,
  }));
  const parser = new Parser({
    fields: ["name", "clientName", "status", "priority", "manager", "startDate", "endDate"],
  });
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("projects.csv");
  res.send(csv);
});

export const allocationsExportCsv = asyncHandler(async (req, res) => {
  const data = await reportsService.getAllocationsExport();
  const rows = data.map((row) => ({
    employee: row.employeeId?.name || "",
    email: row.employeeId?.email || "",
    project: row.projectId?.name || "",
    role: row.role || "",
    allocationPercent: row.allocationPercent,
    billable: row.billable,
    startDate: row.startDate,
    endDate: row.endDate,
  }));
  const parser = new Parser({
    fields: [
      "employee",
      "email",
      "project",
      "role",
      "allocationPercent",
      "billable",
      "startDate",
      "endDate",
    ],
  });
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("allocations.csv");
  res.send(csv);
});

export const tasksCsv = asyncHandler(async (req, res) => {
  const data = await reportsService.getTasksExport();
  const rows = data.map((row) => ({
    title: row.title,
    project: row.projectId?.name || "",
    assignee: row.assigneeId?.name || "",
    status: row.status,
    priority: row.priority,
    startDate: row.startDate,
    dueDate: row.dueDate,
  }));
  const parser = new Parser({
    fields: ["title", "project", "assignee", "status", "priority", "startDate", "dueDate"],
  });
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("tasks.csv");
  res.send(csv);
});
