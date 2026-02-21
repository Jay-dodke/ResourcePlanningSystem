import API from "../api/axios";

export const listProjectRequests = (params) => API.get("/project-requests", {params});
export const listMyProjectRequests = (params) => API.get("/project-requests/my", {params});
export const createProjectExitRequest = (payload) => API.post("/project-requests/exit", payload);
export const createProjectRequest = (payload) => API.post("/project-requests", payload);
export const approveProjectRequest = (id) => API.put(`/project-requests/${id}/approve`);
export const rejectProjectRequest = (id) => API.put(`/project-requests/${id}/reject`);
