import xss from "xss";

const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

const sanitizeXss = (value) => {
  if (value == null) return value;

  if (typeof value === "string") {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeXss(item));
  }

  if (isPlainObject(value)) {
    Object.keys(value).forEach((key) => {
      value[key] = sanitizeXss(value[key]);
    });
  }

  return value;
};

export const xssSanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeXss(req.body);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeXss(req.params);
  }

  if (req.query && typeof req.query === "object") {
    const queryClone = Array.isArray(req.query) ? [...req.query] : {...req.query};
    req.sanitizedQuery = sanitizeXss(queryClone);
  }

  return next();
};
