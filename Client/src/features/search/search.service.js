import API from "../../services/apiClient";

export const globalSearch = (params) => API.get("/search", {params});





