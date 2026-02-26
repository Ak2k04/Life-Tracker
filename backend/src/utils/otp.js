const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const generateLinkToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const hashToken = async (token) => {
    return await bcrypt.hash(token, 12);
};

const compareToken = async (token, hashedToken) => {
    return await bcrypt.compare(token, hashedToken);
};

module.exports = {
    generateOTP,
    generateLinkToken,
    hashToken,
    compareToken
};
