import API from "../api/axios";

export const listAvailability = (params) => API.get("/availability", {params});
export const upsertAvailability = (payload) => API.post("/availability", payload);
