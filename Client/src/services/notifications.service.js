import API from "../api/axios";

export const listNotifications = (params) => API.get("/notifications", {params});
export const createNotification = (payload) => API.post("/notifications", payload);
export const updateNotification = (id, payload) => API.put(`/notifications/${id}`, payload);
