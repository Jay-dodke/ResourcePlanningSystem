import API from "../api/axios";

export const listTasks = (params) => API.get("/tasks", {params});
export const listMyTasks = (params) => API.get("/tasks/my", {params});
export const getTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (payload) => API.post("/tasks", payload);
export const updateTask = (id, payload) => API.put(`/tasks/${id}`, payload);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
