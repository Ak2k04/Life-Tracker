const authService = require('./auth.service');
const { sendSuccess, sendError } = require('../../utils/response');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return sendSuccess(res, null, result.message, 201);
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.message, err.statusCode);
        }
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { token, user } = await authService.login(req.body);
        return sendSuccess(res, { token, user });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.message, err.statusCode);
        }
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { message } = await authService.forgotPassword(req.body.email, req.body.method);
        return sendSuccess(res, null, message);
    } catch (err) {
        next(err);
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { resetToken } = await authService.verifyOtp(req.body.email, req.body.otp);
        return sendSuccess(res, { resetToken });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.message, err.statusCode);
        }
        next(err);
    }
};

const validateResetLink = async (req, res, next) => {
    try {
        const { token, uid } = req.query;
        if (!token || !uid) {
            return sendError(res, 'Link expired or invalid', 400);
        }
        const { resetToken } = await authService.validateResetLink(token, uid);
        return sendSuccess(res, { resetToken });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.message, err.statusCode);
        }
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { message } = await authService.resetPassword(req.body.resetToken, req.body.newPassword);
        return sendSuccess(res, null, message);
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.message, err.statusCode);
        }
        next(err);
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyOtp,
    validateResetLink,
    resetPassword
};
