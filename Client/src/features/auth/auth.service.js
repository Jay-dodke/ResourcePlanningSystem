import API from "../../services/apiClient";

export const login = (payload) => API.post("/auth/login", payload);
export const getMe = () => API.get("/auth/me");
export const changePassword = (payload) => API.post("/auth/change-password", payload);





