import API from "../../services/apiClient";

export const listSkills = (params) => API.get("/skills", {params});
export const createSkill = (payload) => API.post("/skills", payload);
export const updateSkill = (id, payload) => API.put(`/skills/${id}`, payload);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);





