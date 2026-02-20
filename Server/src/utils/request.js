export const getQuery = (req) => req.sanitizedQuery || req.query || {};
