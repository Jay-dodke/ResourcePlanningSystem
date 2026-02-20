import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as skillService from "./skill.service.js";
import * as auditService from "../audit/audit.service.js";

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.validated.body);

  await auditService.logAction({
    actorId: req.user?.id,
    action: "skills.create",
    entity: "Skill",
    entityId: skill._id,
  });

  res.status(201).json({success: true, data: skill});
});

export const listSkills = asyncHandler(async (req, res) => {
  const result = await skillService.listSkills(getQuery(req));
  res.json({success: true, ...result});
});

export const getSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);
  if (!skill) throw new ApiError(404, "Skill not found");
  res.json({success: true, data: skill});
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.validated.body);
  if (!skill) throw new ApiError(404, "Skill not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "skills.update",
    entity: "Skill",
    entityId: skill._id,
  });

  res.json({success: true, data: skill});
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.deleteSkill(req.params.id);
  if (!skill) throw new ApiError(404, "Skill not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "skills.delete",
    entity: "Skill",
    entityId: skill._id,
  });

  res.json({success: true, data: skill});
});
