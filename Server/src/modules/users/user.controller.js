import bcrypt from "bcryptjs";
import crypto from "crypto";
import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as userService from "./user.service.js";
import * as auditService from "../audit/audit.service.js";
import Skill from "../skills/skill.model.js";
import * as notificationService from "../notifications/notification.service.js";

const isAdminUser = (user) => user?.role?.toLowerCase() === "admin";

const normalizeSkills = (skills = []) =>
  skills
    .map((skill) => {
      if (typeof skill === "string") {
        const name = skill.trim();
        if (!name) return null;
        return {name, level: 3};
      }

      if (skill && typeof skill === "object") {
        const name = String(skill.name || "").trim();
        if (!name) return null;
        const level = Number.isFinite(skill.level) ? Number(skill.level) : 3;
        return {name, level: Math.min(5, Math.max(1, level))};
      }

      return null;
    })
    .filter(Boolean);

const ensureSkillCatalog = async (skills = []) => {
  if (!skills.length) return;
  const names = skills.map((skill) => skill.name).filter(Boolean);
  if (!names.length) return;
  await Promise.all(
    names.map((name) =>
      Skill.findOneAndUpdate({name}, {name}, {new: true, upsert: true})
    )
  );
};

export const createUser = asyncHandler(async (req, res) => {
  const {password, skills, ...rest} = req.validated.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const normalizedSkills = normalizeSkills(skills);
  await ensureSkillCatalog(normalizedSkills);

  const user = await userService.createUser({
    ...rest,
    skills: normalizedSkills,
    passwordHash,
  });
  await auditService.logAction({
    actorId: req.user?.id,
    action: "users.create",
    entity: "User",
    entityId: user._id,
  });

  res.status(201).json({success: true, data: user});
});

export const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(getQuery(req));
  res.json({success: true, ...result});
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json({success: true, data: user});
});

export const updateUser = asyncHandler(async (req, res) => {
  const updates = {...req.validated.body};

  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  if (updates.skills) {
    updates.skills = normalizeSkills(updates.skills);
    await ensureSkillCatalog(updates.skills);
  }

  const user = await userService.updateUser(req.params.id, updates);
  if (!user) throw new ApiError(404, "User not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "users.update",
    entity: "User",
    entityId: user._id,
  });

  res.json({success: true, data: user});
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "users.delete",
    entity: "User",
    entityId: user._id,
  });

  res.json({success: true, data: user});
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Avatar image is required");

  const user = await userService.updateUser(req.params.id, {
    avatar: `/uploads/employees/${req.file.filename}`,
  });
  if (!user) throw new ApiError(404, "User not found");

  await auditService.logAction({
    actorId: req.user?.id,
    action: "users.avatar",
    entity: "User",
    entityId: user._id,
  });

  res.json({success: true, data: user});
});

export const resetPassword = asyncHandler(async (req, res) => {
  if (!isAdminUser(req.user)) throw new ApiError(403, "Forbidden");

  const {password} = req.validated.body;
  const nextPassword = password || `${crypto.randomBytes(6).toString("base64url")}A1`;
  const passwordHash = await bcrypt.hash(nextPassword, 10);

  const user = await userService.updateUser(req.params.id, {
    passwordHash,
    mustChangePassword: true,
  });
  if (!user) throw new ApiError(404, "User not found");

  await notificationService.createNotification({
    userId: user._id,
    title: "Password reset",
    message:
      "Your password has been reset by an administrator. Please update it after signing in.",
    type: "warning",
    read: false,
  });

  await auditService.logAction({
    actorId: req.user?.id,
    action: "users.resetPassword",
    entity: "User",
    entityId: user._id,
  });

  res.json({success: true, data: {userId: user._id, temporaryPassword: nextPassword}});
});
