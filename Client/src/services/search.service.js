import API from "../api/axios";

export const globalSearch = (params) => API.get("/search", {params});
