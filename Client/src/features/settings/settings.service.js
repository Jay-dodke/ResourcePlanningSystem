import API from "../../services/apiClient";

export const getSettings = () => API.get("/settings");
export const updateSettings = (payload) => API.put("/settings", payload);





