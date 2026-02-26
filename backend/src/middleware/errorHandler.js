const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error('[Error:', err.message, ']');
    if (err.stack) {
        console.error(err.stack);
    }

    // Handle expected application errors here if needed
    // ...

    // Generic 500 fallback
    sendError(res, err.message || 'Internal Server Error', 500);
};

module.exports = errorHandler;
