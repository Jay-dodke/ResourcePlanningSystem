import Allocation from "../allocations/allocation.model.js";
import Project from "../projects/project.model.js";
import User from "../users/user.model.js";
import Task from "../tasks/task.model.js";

export const getUtilization = async () => {
  const allocations = await Allocation.aggregate([
    {
      $group: {
        _id: "$employeeId",
        totalAllocation: {$sum: "$allocationPercent"},
        assignments: {$sum: 1},
      },
    },
  ]);

  const userMap = new Map(
    (
      await User.find({_id: {$in: allocations.map((item) => item._id)}}).select("name email designation")
    ).map((user) => [String(user._id), user])
  );

  return allocations.map((item) => ({
    employee: userMap.get(String(item._id)) || null,
    totalAllocation: item.totalAllocation,
    assignments: item.assignments,
  }));
};

export const getProjectUtilization = async () => {
  const allocations = await Allocation.aggregate([
    {
      $group: {
        _id: "$projectId",
        totalAllocation: {$sum: "$allocationPercent"},
        members: {$addToSet: "$employeeId"},
      },
    },
    {
      $project: {
        totalAllocation: 1,
        memberCount: {$size: "$members"},
      },
    },
  ]);

  const projectMap = new Map(
    (
      await Project.find({_id: {$in: allocations.map((item) => item._id)}}).select("name status")
    ).map((project) => [String(project._id), project])
  );

  return allocations.map((item) => ({
    project: projectMap.get(String(item._id)) || null,
    totalAllocation: item.totalAllocation,
    memberCount: item.memberCount,
  }));
};

export const getEmployees = async () =>
  User.find()
    .populate("roleId", "name")
    .populate("departmentId", "name")
    .populate("managerId", "name email");

export const getProjects = async () =>
  Project.find().populate("createdBy", "name email").populate("managerId", "name email");

export const getAllocationsExport = async () =>
  Allocation.find()
    .populate("employeeId", "name email designation")
    .populate("projectId", "name status");

export const getTasksExport = async () =>
  Task.find()
    .populate("projectId", "name")
    .populate("assigneeId", "name email");
