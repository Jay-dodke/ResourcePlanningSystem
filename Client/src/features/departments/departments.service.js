import API from "../../services/apiClient";

export const listDepartments = (params) => API.get("/departments", {params});
export const createDepartment = (payload) => API.post("/departments", payload);
export const updateDepartment = (id, payload) => API.put(`/departments/${id}`, payload);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);





