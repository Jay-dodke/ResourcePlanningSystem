import Timesheet from "./timesheet.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createTimesheet = (data) => Timesheet.create(data);

export const listTimesheets = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.projectId) filter.projectId = query.projectId;
  if (query.taskId) filter.taskId = query.taskId;
  if (query.status) filter.status = query.status;

  if (query.startDate || query.endDate) {
    filter.workDate = {};
    if (query.startDate) filter.workDate.$gte = new Date(query.startDate);
    if (query.endDate) filter.workDate.$lte = new Date(query.endDate);
  }

  const [items, total] = await Promise.all([
    Timesheet.find(filter)
      .populate("employeeId", "name email designation")
      .populate("projectId", "name status")
      .populate("taskId", "title status")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Timesheet.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getTimesheetById = (id) =>
  Timesheet.findById(id)
    .populate("employeeId", "name email designation")
    .populate("projectId", "name status")
    .populate("taskId", "title status");

export const updateTimesheet = (id, data) =>
  Timesheet.findByIdAndUpdate(id, data, {new: true})
    .populate("employeeId", "name email designation")
    .populate("projectId", "name status")
    .populate("taskId", "title status");

export const deleteTimesheet = (id) => Timesheet.findByIdAndDelete(id);
