import API from "../api/axios";

export const listAuditLogs = (params) => API.get("/audit", {params});
