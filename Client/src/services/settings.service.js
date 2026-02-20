import API from "../api/axios";

export const getSettings = () => API.get("/settings");
export const updateSettings = (payload) => API.put("/settings", payload);
