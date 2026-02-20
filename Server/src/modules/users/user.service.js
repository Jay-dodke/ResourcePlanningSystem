import User from "./user.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createUser = (data) => User.create(data);

export const listUsers = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.departmentId) {
    filter.departmentId = query.departmentId;
  }

  if (query.managerId) {
    filter.managerId = query.managerId;
  }

  if (query.skill) {
    const skills = query.skill
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (skills.length) {
      filter["skills.name"] = {$in: skills};
    }
  }

  if (query.search) {
    filter.$or = [
      {name: {$regex: query.search, $options: "i"}},
      {email: {$regex: query.search, $options: "i"}},
      {designation: {$regex: query.search, $options: "i"}},
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .populate("roleId")
      .populate("departmentId", "name code")
      .populate("managerId", "name email designation")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getUserById = (id) =>
  User.findById(id)
    .populate("roleId")
    .populate("departmentId", "name code")
    .populate("managerId", "name email designation");

export const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, {new: true})
    .populate("roleId")
    .populate("departmentId", "name code")
    .populate("managerId", "name email designation");

export const deleteUser = (id) => User.findByIdAndDelete(id);

export const getUserByEmail = (email) => User.findOne({email});
