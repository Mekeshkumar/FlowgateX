import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    resetPasswordValidation,
} from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes (require authentication)
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changePasswordValidation, changePassword);
router.put('/profile', protect, updateProfile);

export default router;
