import User from "../users/user.model.js";
import Project from "../projects/project.model.js";
import Availability from "../availability/availability.model.js";
import Allocation from "../allocations/allocation.model.js";
import Task from "../tasks/task.model.js";

export const getDashboard = async () => {
  const now = new Date();
  const [
    totalEmployees,
    activeProjects,
    availabilityDocs,
    allocations,
    recentProjects,
    recentAllocations,
    upcomingProjects,
    upcomingTasks,
  ] = await Promise.all([
    User.countDocuments({status: "active"}),
    Project.countDocuments({status: "active"}),
    Availability.find().populate("employeeId", "name designation avatar"),
    Allocation.find(),
    Project.find().sort("-createdAt").limit(5),
    Allocation.find()
      .sort("-createdAt")
      .limit(5)
      .populate("employeeId", "name avatar designation")
      .populate("projectId", "name status"),
    Project.find({endDate: {$gte: now}}).sort("endDate").limit(5),
    Task.find({dueDate: {$gte: now}})
      .sort("dueDate")
      .limit(5)
      .populate("projectId", "name")
      .populate("assigneeId", "name"),
  ]);

  const availableResources = availabilityDocs.filter((doc) => doc.availablePercent > 0).length;
  const utilizationRate = availabilityDocs.length
    ? Math.round(
        availabilityDocs.reduce((sum, doc) => sum + (100 - doc.availablePercent), 0) /
          availabilityDocs.length
      )
    : 0;

  return {
    kpis: {
      totalEmployees,
      activeProjects,
      availableResources,
      utilizationRate,
    },
    currentProjects: recentProjects,
    resourceAvailability: availabilityDocs
      .sort((a, b) => b.availablePercent - a.availablePercent)
      .slice(0, 5),
    recentAssignments: recentAllocations,
    upcomingDeadlines: [
      ...upcomingProjects.map((project) => ({
        ...project.toObject(),
        type: "project",
      })),
      ...upcomingTasks.map((task) => ({
        _id: task._id,
        name: task.title,
        clientName: task.projectId?.name || "-",
        endDate: task.dueDate,
        type: "task",
      })),
    ].sort((a, b) => new Date(a.endDate) - new Date(b.endDate)),
    allocationSummary: allocations,
  };
};
