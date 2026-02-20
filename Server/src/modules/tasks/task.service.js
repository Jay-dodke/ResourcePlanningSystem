import Task from "./task.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createTask = (data) => Task.create(data);

export const listTasks = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.projectId) filter.projectId = query.projectId;
  if (query.assigneeId) filter.assigneeId = query.assigneeId;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  if (query.search) {
    filter.$or = [
      {title: {$regex: query.search, $options: "i"}},
      {description: {$regex: query.search, $options: "i"}},
    ];
  }

  const [items, total] = await Promise.all([
    Task.find(filter)
      .populate("projectId", "name status")
      .populate("assigneeId", "name email designation avatar")
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getTaskById = (id) =>
  Task.findById(id)
    .populate("projectId", "name status")
    .populate("assigneeId", "name email designation avatar")
    .populate("createdBy", "name email");

export const updateTask = (id, data) =>
  Task.findByIdAndUpdate(id, data, {new: true})
    .populate("projectId", "name status")
    .populate("assigneeId", "name email designation avatar")
    .populate("createdBy", "name email");

export const deleteTask = (id) => Task.findByIdAndDelete(id);
