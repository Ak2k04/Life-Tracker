const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};

const signResetToken = (payload, expiresIn = '5m') => {
    return jwt.sign(payload, env.JWT_RESET_SECRET, { expiresIn });
};

const verifyResetToken = (token) => {
    return jwt.verify(token, env.JWT_RESET_SECRET);
};

module.exports = {
    signToken,
    verifyToken,
    signResetToken,
    verifyResetToken
};
