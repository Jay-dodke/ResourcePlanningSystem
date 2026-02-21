import API from "../../services/apiClient";

export const listAllocations = (params) => API.get("/allocations", {params});
export const listAllocationsByEmployee = (employeeId) =>
  API.get("/allocations/by-employee", {params: {employeeId}});
export const listAllocationsByProject = (projectId) =>
  API.get("/allocations/by-project", {params: {projectId}});
export const createAllocation = (payload) => API.post("/allocations", payload);
export const getAllocationTimeline = (params) => API.get("/allocations/timeline", {params});
export const getAllocationConflicts = (params) => API.get("/allocations/conflicts", {params});
export const getFutureAllocations = (params) => API.get("/allocations/future", {params});





