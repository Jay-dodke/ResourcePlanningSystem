import Role from "./role.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createRole = (data) => Role.create(data);

export const listRoles = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const [items, total] = await Promise.all([
    Role.find().sort(sort).skip(skip).limit(limit),
    Role.countDocuments(),
  ]);

  return {items, total, page, limit};
};

export const getRoleById = (id) => Role.findById(id);

export const updateRole = (id, data) => Role.findByIdAndUpdate(id, data, {new: true});

export const deleteRole = (id) => Role.findByIdAndDelete(id);
