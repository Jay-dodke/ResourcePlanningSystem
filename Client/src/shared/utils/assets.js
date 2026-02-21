const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveOrigin = () => {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return baseUrl;
  }
};

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = resolveOrigin();
  if (path.startsWith("/")) return `${origin}${path}`;
  return `${origin}/${path}`;
};



