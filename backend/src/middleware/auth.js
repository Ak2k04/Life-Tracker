const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // { userId, email, username }
        next();
    } catch (err) {
        return sendError(res, 'Invalid or expired token', 401);
    }
};

module.exports = { requireAuth };
