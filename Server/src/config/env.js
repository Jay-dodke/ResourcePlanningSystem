import {z} from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_ACCESS_SECRET: z.string().min(10, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  CORS_ORIGIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX: z.string().optional(),
  ALLOW_PUBLIC_SIGNUP: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_RESET: z.string().optional(),
  TRUST_PROXY: z.string().optional(),
  BODY_LIMIT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
}

const env = parsed.data;

if (env.NODE_ENV === "production") {
  if (env.JWT_ACCESS_SECRET.includes("change-this")) {
    throw new Error("JWT_ACCESS_SECRET must be set to a secure value in production");
  }
  if (env.JWT_REFRESH_SECRET.includes("change-this")) {
    throw new Error("JWT_REFRESH_SECRET must be set to a secure value in production");
  }
}

export default env;
