import API from "../api/axios";

export const listAllocations = (params) => API.get("/allocations", {params});
export const listAllocationsByEmployee = (employeeId) =>
  API.get("/allocations/by-employee", {params: {employeeId}});
export const listAllocationsByProject = (projectId) =>
  API.get("/allocations/by-project", {params: {projectId}});
export const createAllocation = (payload) => API.post("/allocations", payload);
