const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

const sanitize = (value) => {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach((item) => sanitize(item));
    return;
  }

  if (!isPlainObject(value)) return;

  Object.keys(value).forEach((key) => {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      return;
    }

    sanitize(value[key]);
  });
};

export const sanitizeRequest = (req, res, next) => {
  sanitize(req.body);
  sanitize(req.params);

  if (req.query && typeof req.query === "object") {
    const queryClone = Array.isArray(req.query) ? [...req.query] : {...req.query};
    sanitize(queryClone);
    req.sanitizedQuery = queryClone;
  }

  return next();
};
