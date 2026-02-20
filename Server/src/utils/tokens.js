import crypto from "crypto";
import jwt from "jsonwebtoken";

const parseDurationMs = (value, fallbackMs) => {
  if (!value) return fallbackMs;
  const match = /^([0-9]+)([smhd])$/.exec(value);
  if (!match) return fallbackMs;
  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * unitMs[unit];
};

export const signAccessToken = (user) => {
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || "15m";
  const subject =
    typeof user === "object" ? user.id || user._id || user.userId : user;
  const role =
    typeof user === "object" ? user.role || user.roleName || user.roleId : null;
  const payload = {sub: subject, type: "access"};
  if (role) {
    payload.role = role;
  }
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn});
};

export const signRefreshToken = (userId) => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || "7d";
  return jwt.sign(
    {sub: userId, type: "refresh"},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn, jwtid: crypto.randomUUID()}
  );
};

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const refreshTokenExpiryDate = () => {
  const ms = parseDurationMs(process.env.JWT_REFRESH_EXPIRES, 7 * 24 * 60 * 60 * 1000);
  return new Date(Date.now() + ms);
};
