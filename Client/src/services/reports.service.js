import API from "../api/axios";

export const utilizationReport = () => API.get("/reports/utilization");
export const projectReport = () => API.get("/reports/projects");
export const exportUtilizationCsv = () => API.get("/reports/utilization.csv", {responseType: "blob"});
export const exportEmployeesCsv = () => API.get("/reports/employees.csv", {responseType: "blob"});
export const exportProjectsCsv = () => API.get("/reports/projects.csv", {responseType: "blob"});
export const exportAllocationsCsv = () => API.get("/reports/allocations.csv", {responseType: "blob"});
export const exportTasksCsv = () => API.get("/reports/tasks.csv", {responseType: "blob"});
