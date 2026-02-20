import User from "../users/user.model.js";
import Project from "../projects/project.model.js";
import Task from "../tasks/task.model.js";

export const globalSearch = async ({q, limit = 5}) => {
  const query = String(q || "").trim();
  if (!query) {
    return {users: [], projects: [], tasks: []};
  }

  const regex = {$regex: query, $options: "i"};
  const [users, projects, tasks] = await Promise.all([
    User.find({
      $or: [{name: regex}, {email: regex}, {designation: regex}, {"skills.name": regex}],
    })
      .limit(limit)
      .select("name email designation")
      .populate("departmentId", "name"),
    Project.find({$or: [{name: regex}, {clientName: regex}]})
      .limit(limit)
      .select("name clientName status"),
    Task.find({$or: [{title: regex}, {description: regex}]})
      .limit(limit)
      .populate("projectId", "name")
      .populate("assigneeId", "name"),
  ]);

  return {users, projects, tasks};
};
