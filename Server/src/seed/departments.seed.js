import Department from "../modules/departments/department.model.js";

const departmentData = [
  {name: "Engineering", code: "ENG"},
  {name: "Delivery", code: "DEL"},
  {name: "Frontend", code: "FE"},
  {name: "Backend", code: "BE"},
  {name: "QA", code: "QA"},
  {name: "DevOps", code: "DEVOPS"},
  {name: "UIUX", code: "UIUX"},
  {name: "PM", code: "PM"},
  {name: "Support", code: "SUP"},
];

export const getSeedDepartments = () => departmentData;

export const seedDepartments = async ({managerId} = {}) => {
  const departments = [];
  for (const data of departmentData) {
    const payload = managerId ? {...data, managerId} : data;
    const dept = await Department.findOneAndUpdate({name: data.name}, payload, {
      new: true,
      upsert: true,
    });
    departments.push(dept);
  }

  const departmentMap = departments.reduce((acc, dept) => {
    acc[dept.name] = dept;
    return acc;
  }, {});

  return {departments, departmentMap};
};
