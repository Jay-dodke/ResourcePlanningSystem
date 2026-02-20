import {ApiError} from "../utils/apiError.js";

export const errorHandler = (err, req, res, _next) => {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    console.error("Error:", err);
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value",
      details: err.keyValue,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: err.errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS rejected",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Server error",
    ...(isProd
      ? {}
      : {
          details: err.message,
          stack: err.stack,
        }),
  });
};

export const notFound = (req, res, next) => {
  return next(new ApiError(404, "Route not found"));
};
