import API from "../api/axios";

export const listRoles = (params) => API.get("/roles", {params});
