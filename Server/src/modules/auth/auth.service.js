import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import RefreshToken from "./refreshToken.model.js";
import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import {ApiError} from "../../utils/apiError.js";
import {hashToken, refreshTokenExpiryDate, signAccessToken, signRefreshToken} from "../../utils/tokens.js";

export const register = async ({name, email, password, roleId}) => {
  const existing = await User.findOne({email});
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let resolvedRoleId = roleId;

  if (!resolvedRoleId) {
    const employeeRole = await Role.findOne({name: "Employee"});
    resolvedRoleId = employeeRole?._id;
  }

  const user = await User.create({
    name,
    email,
    passwordHash,
    roleId: resolvedRoleId,
  });

  return user;
};

export const login = async ({email, password}) => {
  const user = await User.findOne({email}).select("+passwordHash").populate("roleId");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User is not active");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({id: user._id, role: user.roleId?.name});
  let refreshToken = signRefreshToken(user._id);
  let saved = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const tokenHash = hashToken(refreshToken);
    try {
      await RefreshToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: refreshTokenExpiryDate(),
      });
      saved = true;
      break;
    } catch (err) {
      if (err.code === 11000 && attempt === 0) {
        refreshToken = signRefreshToken(user._id);
        continue;
      }
      throw err;
    }
  }

  if (!saved) {
    throw new ApiError(500, "Unable to issue refresh token");
  }

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.roleId?.name || "user",
    permissions: user.roleId?.permissions || [],
    avatar: user.avatar || "",
    mustChangePassword: Boolean(user.mustChangePassword),
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (_err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (payload.type !== "refresh") {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({tokenHash, revokedAt: null});
  if (!tokenDoc) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (tokenDoc.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token expired");
  }

  const user = await User.findById(payload.sub).populate("roleId");
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = signAccessToken({id: user._id, role: user.roleId?.name});
  let newRefreshToken = signRefreshToken(user._id);
  let saved = false;

  tokenDoc.revokedAt = new Date();
  await tokenDoc.save();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const newHash = hashToken(newRefreshToken);
    try {
      await RefreshToken.create({
        userId: user._id,
        tokenHash: newHash,
        expiresAt: refreshTokenExpiryDate(),
      });
      saved = true;
      break;
    } catch (err) {
      if (err.code === 11000 && attempt === 0) {
        newRefreshToken = signRefreshToken(user._id);
        continue;
      }
      throw err;
    }
  }

  if (!saved) {
    throw new ApiError(500, "Unable to issue refresh token");
  }

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.roleId?.name || "user",
    permissions: user.roleId?.permissions || [],
    avatar: user.avatar || "",
    mustChangePassword: Boolean(user.mustChangePassword),
  };

  return {
    user: safeUser,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({tokenHash, revokedAt: null});
  if (tokenDoc) {
    tokenDoc.revokedAt = new Date();
    await tokenDoc.save();
  }
};

export const changePassword = async ({userId, currentPassword, newPassword}) => {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.mustChangePassword) {
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required");
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "Invalid credentials");
    }
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  await user.save();
};
