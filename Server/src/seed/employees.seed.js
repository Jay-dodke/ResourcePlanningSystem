import crypto from "crypto";
import bcrypt from "bcryptjs";
import Role from "../modules/roles/role.model.js";
import User from "../modules/users/user.model.js";
import Department from "../modules/departments/department.model.js";
import {ADMIN_PERMISSIONS} from "../utils/permissions.js";

const employeePermissions = [
  "dashboard:read",
  "projects:read",
  "allocations:read",
  "availability:read",
  "tasks:read",
  "timesheets:read",
  "timesheets:write",
  "leaves:read",
  "leaves:write",
  "notifications:read",
  "project-requests:read",
  "project-requests:write",
  "search:read",
];

const departmentNames = ["Frontend", "Backend", "QA", "DevOps", "UIUX", "PM", "Support"];

const maleFirstNames = [
  "Aarav",
  "Abhishek",
  "Aditya",
  "Akhil",
  "Aman",
  "Amit",
  "Anand",
  "Aniket",
  "Anirudh",
  "Ankit",
  "Arjun",
  "Arnav",
  "Ashwin",
  "Deepak",
  "Dev",
  "Gaurav",
  "Harsh",
  "Ishan",
  "Karan",
  "Kunal",
  "Manish",
  "Mohit",
  "Naveen",
  "Nikhil",
  "Pranav",
  "Raghav",
  "Rahul",
  "Rajat",
  "Rajesh",
  "Rakesh",
  "Rohan",
  "Rohit",
  "Sahil",
  "Sanjay",
  "Sarthak",
  "Siddharth",
  "Sourav",
  "Sujay",
  "Sunil",
  "Suraj",
  "Suresh",
  "Tarun",
  "Varun",
  "Vikas",
  "Vikram",
  "Vivek",
  "Yash",
];

const femaleFirstNames = [
  "Aarti",
  "Aishwarya",
  "Ananya",
  "Anita",
  "Anjali",
  "Ankita",
  "Archana",
  "Bhavana",
  "Divya",
  "Garima",
  "Isha",
  "Ishita",
  "Jyoti",
  "Kavya",
  "Khushi",
  "Kriti",
  "Lakshmi",
  "Madhuri",
  "Meera",
  "Megha",
  "Neha",
  "Nisha",
  "Pooja",
  "Prachi",
  "Priya",
  "Rashmi",
  "Ritu",
  "Riya",
  "Sakshi",
  "Sana",
  "Sneha",
  "Sonali",
  "Shalini",
  "Shreya",
  "Shruti",
  "Simran",
  "Sonia",
  "Swati",
  "Tanvi",
  "Trisha",
  "Vaishali",
  "Vidya",
  "Zoya",
];

const lastNames = [
  "Acharya",
  "Agarwal",
  "Bansal",
  "Banerjee",
  "Basu",
  "Bedi",
  "Bhatt",
  "Bose",
  "Chakraborty",
  "Chatterjee",
  "Chauhan",
  "Das",
  "Desai",
  "Dutta",
  "Ghosh",
  "Gowda",
  "Gupta",
  "Iyer",
  "Jain",
  "Joshi",
  "Kapoor",
  "Khan",
  "Khanna",
  "Kohli",
  "Kulkarni",
  "Kumar",
  "Mahajan",
  "Malhotra",
  "Mehta",
  "Menon",
  "Mishra",
  "Naik",
  "Nair",
  "Narang",
  "Nayak",
  "Pandey",
  "Patel",
  "Pillai",
  "Rao",
  "Reddy",
  "Roy",
  "Saha",
  "Saxena",
  "Sen",
  "Shah",
  "Sharma",
  "Shetty",
  "Singh",
  "Sinha",
  "Subramanian",
  "Trivedi",
  "Varma",
  "Verma",
  "Vyas",
  "Yadav",
];

const designationByDept = {
  Frontend: ["Frontend Engineer", "UI Developer", "Senior Frontend Engineer", "Frontend Specialist"],
  Backend: ["Backend Engineer", "API Developer", "Senior Backend Engineer", "Software Engineer"],
  QA: ["QA Engineer", "Test Automation Engineer", "Senior QA Engineer", "Quality Analyst"],
  DevOps: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "DevOps Specialist"],
  UIUX: ["UI/UX Designer", "Product Designer", "UX Researcher", "UX Designer"],
  PM: ["Project Manager", "Product Manager", "Program Manager", "Delivery Manager"],
  Support: ["Support Engineer", "Technical Support Engineer", "Customer Support Specialist", "Support Analyst"],
};

const managerDesignations = ["Engineering Manager", "Delivery Manager", "Project Manager", "Program Manager"];
const leadDesignations = ["Tech Lead", "QA Lead", "DevOps Lead", "Design Lead", "Support Lead"];
const adminDesignations = ["System Admin", "IT Administrator", "Platform Admin"];

const departmentSkillMap = {
  Frontend: ["React", "Angular", "Vue.js", "Next.js", "UI Design"],
  Backend: [
    "Node.js",
    "Express",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "Python",
    "Django",
    "SQL",
    "PostgreSQL",
    "MongoDB",
  ],
  QA: ["QA", "Selenium", "Cypress", "Playwright", "Jest"],
  DevOps: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Networking"],
  UIUX: ["Figma", "UX Research", "UI Design"],
  PM: ["Planning", "Agile", "Scrum", "Jira"],
  Support: ["IT Support", "Networking", "Jira"],
};

const interleave = (left, right) => {
  const output = [];
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) {
    if (left[i]) {
      output.push(left[i]);
    }
    if (right[i]) {
      output.push(right[i]);
    }
  }
  return output;
};

const buildNamePool = (targetCount) => {
  const output = [];
  const firstNames = interleave(maleFirstNames, femaleFirstNames);
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      output.push(`${firstName} ${lastName}`);
      if (output.length >= targetCount) {
        return output;
      }
    }
  }
  return output;
};

const toEmailPart = (value) => value.toLowerCase().replace(/[^a-z]/g, "");
const buildEmail = (fullName, domain) => {
  const [firstName, lastName] = fullName.split(" ");
  return `${toEmailPart(firstName)}.${toEmailPart(lastName)}@${domain}`;
};

const pickFrom = (items, index) => items[index % items.length];

const buildSkillSet = (departmentName, seedIndex, roleName, skillNames) => {
  const baseCount = roleName === "Employee" ? 3 : 4;
  const skillCount = Math.min(skillNames.length, baseCount + (seedIndex % 2));
  const skillPool = [...(departmentSkillMap[departmentName] || []), ...skillNames];
  const used = new Set();
  const selected = [];
  let offset = 0;
  while (selected.length < skillCount && offset < skillPool.length) {
    const name = skillPool[(seedIndex + offset * 5) % skillPool.length];
    if (!used.has(name)) {
      used.add(name);
      selected.push({name, level: 2 + ((seedIndex + offset) % 4)});
    }
    offset += 1;
  }
  return selected;
};

const buildPassword = (email, seed) => {
  const hash = crypto.createHash("sha256").update(`${seed}:${email}`).digest("base64url");
  return `Emp@${hash.slice(0, 8)}`;
};

export const seedEmployees = async ({skills = [], departments = []} = {}) => {
  const adminRole = await Role.findOneAndUpdate(
    {name: "Admin"},
    {name: "Admin", permissions: ADMIN_PERMISSIONS},
    {new: true, upsert: true}
  );
  const employeeRole = await Role.findOneAndUpdate(
    {name: "Employee"},
    {name: "Employee", permissions: employeePermissions},
    {new: true, upsert: true}
  );
  const managerRole = await Role.findOneAndUpdate(
    {name: "Manager"},
    {name: "Manager", permissions: employeePermissions},
    {new: true, upsert: true}
  );
  const leadRole = await Role.findOneAndUpdate(
    {name: "Lead"},
    {name: "Lead", permissions: employeePermissions},
    {new: true, upsert: true}
  );

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@rps.local";
  let adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SEED_ADMIN_PASSWORD is required in production");
    }
    adminPassword = crypto.randomBytes(9).toString("base64url");
    console.log(`Generated admin password: ${adminPassword}`);
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  let adminUser = await User.findOne({email: adminEmail});
  if (!adminUser) {
    adminUser = await User.create({
      name: "Admin User",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      roleId: adminRole._id,
      designation: "System Admin",
    });
  }

  const employeeEmails = ["alex@rps.local", "jamie@rps.local", "taylor@rps.local"];
  const employeeUsers = [];

  for (const email of employeeEmails) {
    let employee = await User.findOne({email});
    if (!employee) {
      const skillSet = [
        {name: skills[0]?.name || "React", level: 4},
        {name: skills[1]?.name || "Node.js", level: 3},
      ];
      employee = await User.create({
        name: email.split("@")[0].replace(/^[a-z]/, (c) => c.toUpperCase()),
        email,
        passwordHash: adminPasswordHash,
        roleId: employeeRole._id,
        designation: "Project Specialist",
        skills: skillSet,
        departmentId: departments[0]?._id,
        managerId: adminUser._id,
      });
    }
    employeeUsers.push(employee);
  }

  const departmentMap = departments.reduce((acc, dept) => {
    acc[dept.name] = dept;
    return acc;
  }, {});

  const seedEmployeeDomain = process.env.SEED_EMPLOYEE_DOMAIN || "company.com";
  const totalSeedEmployees = Number(process.env.SEED_EMPLOYEE_COUNT || "400");
  const adminTarget = Number(process.env.SEED_EMPLOYEE_ADMIN_COUNT || "6");
  const managerTarget = Number(process.env.SEED_EMPLOYEE_MANAGER_COUNT || "32");
  const leadTarget = Number(process.env.SEED_EMPLOYEE_LEAD_COUNT || "72");
  const adjustedTotal = Math.max(0, totalSeedEmployees - 1);
  const adminSeedCount = Math.max(0, adminTarget - 1);
  let employeeTarget = adjustedTotal - adminSeedCount - managerTarget - leadTarget;
  if (employeeTarget < 0) {
    employeeTarget = 0;
  }
  const seedUserCount = adminSeedCount + managerTarget + leadTarget + employeeTarget;

  const skillNames = skills.length ? skills.map((skill) => skill.name) : ["React", "Node.js", "QA"];
  const passwordSeed = process.env.SEED_EMPLOYEE_PASSWORD_SEED || "rps-seed";

  const upsertUser = async ({
    name,
    email,
    roleId,
    designation,
    departmentId,
    managerId,
    skills: skillSet,
  }) => {
    const passwordHash = await bcrypt.hash(buildPassword(email, passwordSeed), 10);
    return User.findOneAndUpdate(
      {email},
      {
        $set: {
          name,
          email,
          roleId,
          designation,
          departmentId,
          managerId,
          skills: skillSet,
          status: "active",
          mustChangePassword: true,
        },
        $setOnInsert: {passwordHash},
      },
      {new: true, upsert: true, setDefaultsOnInsert: true}
    );
  };

  if (seedUserCount > 0) {
    const namePool = buildNamePool(seedUserCount);
    if (namePool.length < seedUserCount) {
      throw new Error("Not enough unique names to seed employees.");
    }

    let nameCursor = 0;
    const takeName = () => namePool[nameCursor++];
    const adminDeptId = departmentMap.PM?._id || departments[0]?._id;

    const admins = [adminUser];
    for (let i = 0; i < adminSeedCount; i += 1) {
      const fullName = takeName();
      const email = buildEmail(fullName, seedEmployeeDomain);
      const designation = pickFrom(adminDesignations, i);
      const user = await upsertUser({
        name: fullName,
        email,
        roleId: adminRole._id,
        designation,
        departmentId: adminDeptId,
        managerId: null,
        skills: buildSkillSet("PM", i, "Admin", skillNames),
      });
      admins.push(user);
    }

    const managers = [];
    const managersByDepartment = {};
    for (let i = 0; i < managerTarget; i += 1) {
      const departmentName = departmentNames[i % departmentNames.length];
      const departmentId = departmentMap[departmentName]?._id || departments[0]?._id;
      const fullName = takeName();
      const email = buildEmail(fullName, seedEmployeeDomain);
      const designation = pickFrom(managerDesignations, i);
      const managerOfManager = admins[i % admins.length];
      const user = await upsertUser({
        name: fullName,
        email,
        roleId: managerRole._id,
        designation,
        departmentId,
        managerId: managerOfManager?._id,
        skills: buildSkillSet(departmentName, i, "Manager", skillNames),
      });
      managers.push(user);
      if (!managersByDepartment[departmentName]) {
        managersByDepartment[departmentName] = [];
      }
      managersByDepartment[departmentName].push(user);
    }

    const leads = [];
    const leadsByDepartment = {};
    for (let i = 0; i < leadTarget; i += 1) {
      const departmentName = departmentNames[i % departmentNames.length];
      const departmentId = departmentMap[departmentName]?._id || departments[0]?._id;
      const fullName = takeName();
      const email = buildEmail(fullName, seedEmployeeDomain);
      const designation = pickFrom(leadDesignations, i);
      const managerPool = managersByDepartment[departmentName] || managers;
      const directManager = managerPool[i % managerPool.length] || admins[i % admins.length];
      const user = await upsertUser({
        name: fullName,
        email,
        roleId: leadRole._id,
        designation,
        departmentId,
        managerId: directManager?._id,
        skills: buildSkillSet(departmentName, i, "Lead", skillNames),
      });
      leads.push(user);
      if (!leadsByDepartment[departmentName]) {
        leadsByDepartment[departmentName] = [];
      }
      leadsByDepartment[departmentName].push(user);
    }

    for (let i = 0; i < employeeTarget; i += 1) {
      const departmentName = departmentNames[i % departmentNames.length];
      const departmentId = departmentMap[departmentName]?._id || departments[0]?._id;
      const fullName = takeName();
      const email = buildEmail(fullName, seedEmployeeDomain);
      const designation = pickFrom(designationByDept[departmentName] || designationByDept.Backend, i);
      const leadPool = leadsByDepartment[departmentName] || leads;
      const fallbackManager =
        managersByDepartment[departmentName]?.[0] || managers[i % managers.length] || admins[0];
      const directManager = leadPool[i % leadPool.length] || fallbackManager;
      await upsertUser({
        name: fullName,
        email,
        roleId: employeeRole._id,
        designation,
        departmentId,
        managerId: directManager?._id,
        skills: buildSkillSet(departmentName, i, "Employee", skillNames),
      });
    }

    for (const departmentName of departmentNames) {
      const department = departmentMap[departmentName];
      const manager = managersByDepartment[departmentName]?.[0] || admins[0];
      if (department && manager) {
        await Department.findByIdAndUpdate(department._id, {managerId: manager._id});
      }
    }
  }

  return {adminUser, employeeUsers};
};
