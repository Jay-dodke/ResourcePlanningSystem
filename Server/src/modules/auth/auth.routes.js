import express from "express";
import {validate} from "../../middlewares/validate.middleware.js";
import {optionalAuth} from "../../middlewares/auth.middleware.js";
import * as authController from "./auth.controller.js";
import {loginSchema, refreshSchema, registerSchema, changePasswordSchema} from "./auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.post("/logout", validate(refreshSchema), authController.logout);
router.post("/register", optionalAuth, validate(registerSchema), authController.register);
router.get("/me", authController.me);
router.post("/change-password", validate(changePasswordSchema), authController.changePassword);

export default router;
