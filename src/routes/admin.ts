import express from "express";
import { adminController } from "../controller";
import { adminJWT, validateAdminLogin } from '../middleware';

const router = express.Router();

// Public routes (no authentication)
router.post('/signUp', adminController.signUp);
router.post('/login', validateAdminLogin, adminController.admin_login);
router.post('/forgot_password', adminController.forgot_password);
router.post('/forgot_password_otp', adminController.forgot_password_otp_verification);
router.post('/reset_password', adminController.reset_password);

// Protected routes (require authentication)
router.use(adminJWT);
router.post('/logout', adminController.admin_LogOut);

export const adminRoutes = router;