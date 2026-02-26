const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const validate = require('../../middleware/validate');
const authController = require('./auth.controller');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

router.use(authLimiter);

const registerSchema = {
    username: (val) => {
        if (!val || !/^[a-zA-Z0-9_]{3,30}$/.test(val)) return 'Username must be 3-30 alphanumeric characters or underscores';
        return null;
    },
    email: (val) => {
        if (!val || !/^\S+@\S+\.\S+$/.test(val)) return 'Valid email is required';
        return null;
    },
    password: (val) => {
        if (!val || val.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(val)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(val)) return 'Password must contain at least one number';
        if (!/[^a-zA-Z0-9]/.test(val)) return 'Password must contain at least one special character';
        return null;
    }
};

const loginSchema = {
    identifier: (val) => !val ? 'Username or email is required' : null,
    password: (val) => !val ? 'Password is required' : null,
};

const forgotPasswordSchema = {
    email: (val) => (!val || !/^\S+@\S+\.\S+$/.test(val)) ? 'Valid email is required' : null,
    method: (val) => (val !== 'otp' && val !== 'link') ? 'Method must be otp or link' : null,
};

const verifyOtpSchema = {
    email: (val) => (!val || !/^\S+@\S+\.\S+$/.test(val)) ? 'Valid email is required' : null,
    otp: (val) => (!val || !/^\d{6}$/.test(val)) ? 'Valid 6-digit OTP is required' : null,
};

const resetPasswordSchema = {
    resetToken: (val) => !val ? 'Reset token is required' : null,
    newPassword: registerSchema.password
};

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.get('/reset-password/validate', authController.validateResetLink);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
