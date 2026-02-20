import Department from "./department.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createDepartment = (data) => Department.create(data);

export const listDepartments = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.search) {
    filter.$or = [
      {name: {$regex: query.search, $options: "i"}},
      {code: {$regex: query.search, $options: "i"}},
    ];
  }

  const [items, total] = await Promise.all([
    Department.find(filter)
      .populate("managerId", "name email designation")
      .populate("parentId", "name code")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Department.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getDepartmentById = (id) =>
  Department.findById(id)
    .populate("managerId", "name email designation")
    .populate("parentId", "name code");

export const updateDepartment = (id, data) =>
  Department.findByIdAndUpdate(id, data, {new: true})
    .populate("managerId", "name email designation")
    .populate("parentId", "name code");

export const deleteDepartment = (id) => Department.findByIdAndDelete(id);
