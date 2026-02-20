import API from "../api/axios";

export const getAnalytics = () => API.get("/analytics");
