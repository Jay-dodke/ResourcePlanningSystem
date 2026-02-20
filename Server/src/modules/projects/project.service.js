import Project from "./project.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createProject = (data) => Project.create(data);

export const listProjects = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      {name: {$regex: query.search, $options: "i"}},
      {clientName: {$regex: query.search, $options: "i"}},
    ];
  }

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate("createdBy", "name email")
      .populate("managerId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getProjectById = (id) =>
  Project.findById(id).populate("createdBy", "name email").populate("managerId", "name email");

export const updateProject = (id, data) =>
  Project.findByIdAndUpdate(id, data, {new: true})
    .populate("createdBy", "name email")
    .populate("managerId", "name email");

export const deleteProject = (id) => Project.findByIdAndDelete(id);
