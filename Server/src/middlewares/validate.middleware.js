import {ApiError} from "../utils/apiError.js";

export const validate = (schema) => (req, res, next) => {
  if (!schema) return next();
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.sanitizedQuery || req.query,
  });

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return next(new ApiError(400, "Validation failed", issues));
  }

  req.validated = result.data;
  return next();
};
