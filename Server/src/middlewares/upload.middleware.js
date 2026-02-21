import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const employeeAvatarDir = path.resolve(process.cwd(), "uploads", "employees");
fs.mkdirSync(employeeAvatarDir, {recursive: true});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, employeeAvatarDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 5 ? ext : "";
    const filename = `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
    cb(null, filename);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  return cb(new Error("Only image uploads are allowed"), false);
};

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 5 * 1024 * 1024},
});
