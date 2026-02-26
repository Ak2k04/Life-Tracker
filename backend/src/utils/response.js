const sendSuccess = (res, data, message = null, statusCode = 200, meta = undefined) => {
    const response = { success: true };
    if (message) response.message = message;
    if (data !== undefined && data !== null) response.data = data;
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 400, errors = undefined) => {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
