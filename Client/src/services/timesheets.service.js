import API from "../api/axios";

export const listTimesheets = (params) => API.get("/timesheets", {params});
export const createTimesheet = (payload) => API.post("/timesheets", payload);
export const updateTimesheet = (id, payload) => API.put(`/timesheets/${id}`, payload);
export const deleteTimesheet = (id) => API.delete(`/timesheets/${id}`);
