import API from "../../services/apiClient";

export const listLeaves = (params) => API.get("/leaves", {params});
export const createLeave = (payload) => API.post("/leaves", payload);
export const updateLeave = (id, payload) => API.put(`/leaves/${id}`, payload);
export const deleteLeave = (id) => API.delete(`/leaves/${id}`);





