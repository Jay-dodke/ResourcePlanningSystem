import API from "../api/axios";

export const getPlanningSummary = (params) => API.get("/me/planning-summary", {params});
