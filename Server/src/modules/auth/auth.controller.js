import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {requireAuth} from "../../middlewares/auth.middleware.js";
import * as authService from "./auth.service.js";
import User from "../users/user.model.js";
import {PERMISSIONS} from "../../utils/permissions.js";

export const register = asyncHandler(async (req, res) => {
  const allowPublic = process.env.ALLOW_PUBLIC_SIGNUP === "true";
  const userCount = await User.countDocuments();

  if (!allowPublic && userCount > 0) {
    if (!req.user?.permissions?.includes(PERMISSIONS.USERS_WRITE)) {
      throw new ApiError(403, "Forbidden");
    }
  }

  const user = await authService.register(req.validated.body);
  res.status(201).json({success: true, data: user});
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  res.json({success: true, ...result});
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.validated.body.refreshToken);
  res.json({success: true, ...result});
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.validated.body.refreshToken);
  res.json({success: true});
});

export const me = [
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({success: true, data: req.user});
  }),
];

export const changePassword = [
  requireAuth,
  asyncHandler(async (req, res) => {
    await authService.changePassword({
      userId: req.user?.id,
      currentPassword: req.validated.body.currentPassword,
      newPassword: req.validated.body.newPassword,
    });
    res.json({success: true});
  }),
];
