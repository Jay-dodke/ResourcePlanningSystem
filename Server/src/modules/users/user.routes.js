import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import {requirePermissions} from "../../middlewares/role.middleware.js";
import {PERMISSIONS} from "../../utils/permissions.js";
import * as userController from "./user.controller.js";
import {createUserSchema, updateUserSchema, resetPasswordSchema} from "./user.validation.js";
import {avatarUpload} from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requirePermissions(PERMISSIONS.USERS_READ), userController.listUsers);
router.post(
  "/",
  requirePermissions(PERMISSIONS.USERS_WRITE),
  validate(createUserSchema),
  userController.createUser
);
router.post(
  "/:id/avatar",
  requirePermissions(PERMISSIONS.USERS_WRITE),
  avatarUpload.single("avatar"),
  userController.uploadAvatar
);
router.post(
  "/:id/reset-password",
  requirePermissions(PERMISSIONS.USERS_WRITE),
  validate(resetPasswordSchema),
  userController.resetPassword
);
router.get("/:id", requirePermissions(PERMISSIONS.USERS_READ), userController.getUser);
router.put(
  "/:id",
  requirePermissions(PERMISSIONS.USERS_WRITE),
  validate(updateUserSchema),
  userController.updateUser
);
router.delete(
  "/:id",
  requirePermissions(PERMISSIONS.USERS_WRITE),
  userController.deleteUser
);

export default router;
