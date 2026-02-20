import API from "../api/axios";

export const getDashboard = () => API.get("/dashboard");
