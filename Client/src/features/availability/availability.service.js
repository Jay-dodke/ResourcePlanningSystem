import API from "../../services/apiClient";

export const listAvailability = (params) => API.get("/availability", {params});
export const upsertAvailability = (payload) => API.post("/availability", payload);





