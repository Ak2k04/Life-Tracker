const { sendError } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
    const errors = [];

    for (const [field, validator] of Object.entries(schema)) {
        const value = req.body[field];
        const errorMsg = validator(value, req.body);
        if (errorMsg) {
            errors.push({ field, message: errorMsg });
        }
    }

    if (errors.length > 0) {
        return sendError(res, 'Validation failed', 422, errors);
    }

    next();
};

module.exports = validate;
