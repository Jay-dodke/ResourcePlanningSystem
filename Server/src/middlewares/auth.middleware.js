import jwt from "jsonwebtoken";
import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../modules/users/user.model.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = header.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (_err) {
    throw new ApiError(401, "Unauthorized");
  }

  if (payload.type !== "access") {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(payload.sub)
    .populate("roleId")
    .populate("departmentId", "name code")
    .populate("managerId", "name email designation");
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.roleId?.name || "user",
    permissions: user.roleId?.permissions || [],
    avatar: user.avatar || "",
    designation: user.designation || "",
    departmentId: user.departmentId || null,
    managerId: user.managerId || null,
    skills: user.skills || [],
    status: user.status || "active",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    mustChangePassword: Boolean(user.mustChangePassword),
  };

  return next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.type !== "access") return next();
    const user = await User.findById(payload.sub)
      .populate("roleId")
      .populate("departmentId", "name code")
      .populate("managerId", "name email designation");
    if (!user) return next();

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.roleId?.name || "user",
      permissions: user.roleId?.permissions || [],
      avatar: user.avatar || "",
      designation: user.designation || "",
      departmentId: user.departmentId || null,
      managerId: user.managerId || null,
      skills: user.skills || [],
      status: user.status || "active",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      mustChangePassword: Boolean(user.mustChangePassword),
    };
  } catch (_err) {
    return next();
  }

  return next();
});
