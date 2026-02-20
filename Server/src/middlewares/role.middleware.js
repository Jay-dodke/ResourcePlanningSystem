import {ApiError} from "../utils/apiError.js";

export const requirePermissions = (...permissions) => (req, res, next) => {
  const roleName = req.user?.role || req.user?.roleId?.name || "";
  if (roleName.toLowerCase() === "admin") {
    return next();
  }

  const current = req.user?.permissions || [];
  const missing = permissions.filter((permission) => !current.includes(permission));

  if (missing.length > 0) {
    return next(new ApiError(403, "Forbidden"));
  }

  return next();
};
