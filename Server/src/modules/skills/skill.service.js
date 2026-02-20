import Skill from "./skill.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createSkill = (data) => Skill.create(data);

export const listSkills = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.search) {
    filter.$or = [
      {name: {$regex: query.search, $options: "i"}},
      {category: {$regex: query.search, $options: "i"}},
    ];
  }

  const [items, total] = await Promise.all([
    Skill.find(filter).sort(sort).skip(skip).limit(limit),
    Skill.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getSkillById = (id) => Skill.findById(id);

export const updateSkill = (id, data) => Skill.findByIdAndUpdate(id, data, {new: true});

export const deleteSkill = (id) => Skill.findByIdAndDelete(id);
