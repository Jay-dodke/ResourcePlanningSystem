import ProjectRequest from "./projectRequest.model.js";
import Allocation from "../allocations/allocation.model.js";
import {getPagination} from "../../utils/pagination.js";
import {ApiError} from "../../utils/apiError.js";

export const createProjectRequest = async ({employeeId, projectId, allocationId, reason}) => {
  const allocationFilter = {employeeId, projectId};
  if (allocationId) {
    allocationFilter._id = allocationId;
  }

  const allocation = await Allocation.findOne(allocationFilter);

  if (!allocation) {
    throw new ApiError(404, "Allocation not found for this project");
  }

  const existing = await ProjectRequest.findOne({
    employeeId,
    projectId,
    status: "pending",
  });

  if (existing) {
    throw new ApiError(409, "A pending request already exists for this project");
  }

  return ProjectRequest.create({
    employeeId,
    projectId,
    allocationId: allocation._id,
    reason,
  });
};

export const listProjectRequests = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.projectId) filter.projectId = query.projectId;

  const [items, total] = await Promise.all([
    ProjectRequest.find(filter)
      .populate("employeeId", "name email designation avatar")
      .populate("projectId", "name status")
      .populate("reviewedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    ProjectRequest.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getProjectRequestById = (id) =>
  ProjectRequest.findById(id)
    .populate("employeeId", "name email designation avatar")
    .populate("projectId", "name status")
    .populate("reviewedBy", "name email");

export const updateProjectRequest = (id, data) =>
  ProjectRequest.findByIdAndUpdate(id, data, {new: true})
    .populate("employeeId", "name email designation avatar")
    .populate("projectId", "name status")
    .populate("reviewedBy", "name email");
