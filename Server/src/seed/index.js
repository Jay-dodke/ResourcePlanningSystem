import "dotenv/config";
import {connectDb} from "../config/db.js";
import Role from "../modules/roles/role.model.js";
import User from "../modules/users/user.model.js";
import Project from "../modules/projects/project.model.js";
import Allocation from "../modules/allocations/allocation.model.js";
import Availability from "../modules/availability/availability.model.js";
import Notification from "../modules/notifications/notification.model.js";
import Settings from "../modules/settings/settings.model.js";
import Department from "../modules/departments/department.model.js";
import Skill from "../modules/skills/skill.model.js";
import Task from "../modules/tasks/task.model.js";
import Timesheet from "../modules/timesheets/timesheet.model.js";
import Leave from "../modules/leaves/leave.model.js";
import ProjectRequest from "../modules/projectRequests/projectRequest.model.js";
import {seedSkills} from "./skills.seed.js";
import {seedDepartments} from "./departments.seed.js";
import {seedEmployees} from "./employees.seed.js";
import {seedProjects} from "./projects.seed.js";
import {seedAssignments} from "./assignments.seed.js";

const resetData = async () => {
  await Promise.all([
    Role.deleteMany({}),
    User.deleteMany({}),
    Project.deleteMany({}),
    Allocation.deleteMany({}),
    Availability.deleteMany({}),
    Notification.deleteMany({}),
    Settings.deleteMany({}),
    Department.deleteMany({}),
    Skill.deleteMany({}),
    Task.deleteMany({}),
    Timesheet.deleteMany({}),
    Leave.deleteMany({}),
    ProjectRequest.deleteMany({}),
  ]);
};

const runSeeds = async () => {
  await connectDb(process.env.MONGO_URI);

  if (process.env.SEED_RESET === "true") {
    await resetData();
  }

  const skills = await seedSkills();
  const {departments} = await seedDepartments();
  const {adminUser, employeeUsers} = await seedEmployees({skills, departments});
  const projects = await seedProjects({adminUser});
  await seedAssignments({adminUser, employees: employeeUsers, projects});

  console.log("Seed completed");
  process.exit(0);
};

runSeeds().catch((err) => {
  console.error(err);
  process.exit(1);
});
