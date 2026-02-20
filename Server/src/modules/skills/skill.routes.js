import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as skillController from "./skill.controller.js";
import {createSkillSchema, updateSkillSchema} from "./skill.validation.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.SKILLS_READ), skillController.listSkills);
router.post(
  "/",
  requirePermissions(PERMISSIONS.SKILLS_WRITE),
  validate(createSkillSchema),
  skillController.createSkill
);
router.get("/:id", requirePermissions(PERMISSIONS.SKILLS_READ), skillController.getSkill);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.SKILLS_WRITE),
  validate(updateSkillSchema),
  skillController.updateSkill
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.SKILLS_WRITE),
  skillController.deleteSkill
);

export default router;
