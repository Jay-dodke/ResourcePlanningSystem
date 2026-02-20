import API from "../api/axios";

export const listProjects = (params) => API.get("/projects", {params});
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (payload) => API.post("/projects", payload);
export const updateProject = (id, payload) => API.put(`/projects/${id}`, payload);
