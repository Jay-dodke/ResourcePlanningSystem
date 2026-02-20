import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const avatarDir = path.resolve(process.cwd(), "uploads", "avatars");
fs.mkdirSync(avatarDir, {recursive: true});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarDir);
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
  limits: {fileSize: 2 * 1024 * 1024},
});
