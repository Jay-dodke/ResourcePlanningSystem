import API from "../api/axios";

export const listUsers = (params) => API.get("/users", {params});
export const getUser = (id) => API.get(`/users/${id}`);
export const createUser = (payload) => API.post("/users", payload);
export const updateUser = (id, payload) => API.put(`/users/${id}`, payload);
export const uploadUserAvatar = (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return API.post(`/users/${id}/avatar`, formData, {
    headers: {"Content-Type": "multipart/form-data"},
  });
};
export const resetUserPassword = (id, payload) =>
  API.post(`/users/${id}/reset-password`, payload);
