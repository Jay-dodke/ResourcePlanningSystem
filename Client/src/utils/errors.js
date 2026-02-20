export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const apiMessage = error.response?.data?.message;
  if (apiMessage) return apiMessage;
  if (error.message) return error.message;
  return fallback;
};

export const getFieldErrors = (error) => {
  const details = error?.response?.data?.details;
  if (!Array.isArray(details)) return [];
  return details.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
};
