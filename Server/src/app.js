import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import compression from "compression";

import routes from "./routes/index.js";
import {errorHandler, notFound} from "./middlewares/error.middleware.js";
import {sanitizeRequest} from "./middlewares/sanitize.middleware.js";
import {xssSanitizeRequest} from "./middlewares/xss.middleware.js";

const app = express();
const isProd = process.env.NODE_ENV === "production";
const bodyLimit = process.env.BODY_LIMIT || "1mb";
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAllOrigins = corsOrigins.includes("*");
const trustProxy = process.env.TRUST_PROXY;

// Security + parsing
app.disable("x-powered-by");
if (trustProxy) {
  const proxyValue = trustProxy === "true" ? 1 : Number(trustProxy);
  app.set("trust proxy", Number.isNaN(proxyValue) ? 1 : proxyValue);
}
app.use(
  helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"},
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowAllOrigins || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: !allowAllOrigins,
  })
);
app.use(express.json({limit: bodyLimit}));
app.use(express.urlencoded({extended: true, limit: bodyLimit}));
app.use(morgan(isProd ? "combined" : "dev"));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(xssSanitizeRequest);
app.use(hpp());
app.use(compression());
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 200),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Routes
app.get("/health", (req, res) => res.json({success: true, status: "ok"}));
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
