import API from "../api/axios";

export const listUsers = (params) => API.get("/employees", {params});
export const getUser = (id) => API.get(`/employees/${id}`);
export const createUser = (payload) => API.post("/employees", payload);
export const updateUser = (id, payload) => API.put(`/employees/${id}`, payload);
export const uploadUserAvatar = (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return API.post(`/employees/${id}/avatar`, formData);
};
export const resetUserPassword = (id, payload) =>
  API.post(`/employees/${id}/reset-password`, payload);
