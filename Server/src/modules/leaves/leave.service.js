import Leave from "./leave.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createLeave = (data) => Leave.create(data);

export const listLeaves = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;

  if (query.startDate || query.endDate) {
    filter.startDate = {$lte: query.endDate ? new Date(query.endDate) : new Date()};
    filter.endDate = {$gte: query.startDate ? new Date(query.startDate) : new Date(0)};
  }

  const [items, total] = await Promise.all([
    Leave.find(filter)
      .populate("employeeId", "name email designation")
      .populate("approvedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Leave.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getLeaveById = (id) =>
  Leave.findById(id)
    .populate("employeeId", "name email designation")
    .populate("approvedBy", "name email");

export const updateLeave = (id, data) =>
  Leave.findByIdAndUpdate(id, data, {new: true})
    .populate("employeeId", "name email designation")
    .populate("approvedBy", "name email");

export const deleteLeave = (id) => Leave.findByIdAndDelete(id);
