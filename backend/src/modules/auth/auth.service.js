const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { signToken, signResetToken, verifyResetToken } = require('../../utils/jwt');
const { generateOTP, generateLinkToken, hashToken, compareToken } = require('../../utils/otp');
const mailer = require('../../config/mailer');
const env = require('../../config/env');
const { getOTPTemplate, getLinkTemplate } = require('../../utils/emailTemplates');

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const register = async ({ username, email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (emailCheck.rows.length > 0) throw new AuthError('Email already registered', 409);

  const usernameCheck = await db.query('SELECT id FROM users WHERE username = $1', [username]);
  if (usernameCheck.rows.length > 0) throw new AuthError('Username already taken', 409);

  const passwordHash = await bcrypt.hash(password, 12);

  await db.query(
    'INSERT INTO users (username, email, password_hash, is_verified) VALUES ($1, $2, $3, false)',
    [username, normalizedEmail, passwordHash]
  );

  return { message: 'Account created successfully. Please log in.' };
};

const login = async ({ identifier, password }) => {
  const normalizedIdentifier = identifier.toLowerCase();

  const userResult = await db.query(
    'SELECT id, username, email, password_hash FROM users WHERE email = $1 OR username = $1',
    [normalizedIdentifier]
  );

  if (userResult.rows.length === 0) throw new AuthError('Invalid credentials', 401);

  const user = userResult.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) throw new AuthError('Invalid credentials', 401);

  const payload = { userId: user.id, email: user.email, username: user.username };
  const token = signToken(payload, '7d');

  return { token, user: { id: user.id, username: user.username, email: user.email } };
};

const sendEmail = async (to, subject, html) => {
  try {
    await mailer.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Email delivery failed:', err);
  }
};

const forgotPassword = async (email, method) => {
  const normalizedEmail = email.toLowerCase();
  const successMsg = 'If this email is registered, you will receive reset instructions shortly.';

  const userResult = await db.query('SELECT id, username FROM users WHERE email = $1', [normalizedEmail]);
  if (userResult.rows.length === 0) return { message: successMsg };

  const userId = userResult.rows[0].id;

  // Invalidate old tokens
  await db.query('UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false', [userId]);

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  if (method === 'otp') {
    const otp = generateOTP();
    const otpHash = await hashToken(otp);

    await db.query(
      "INSERT INTO password_reset_tokens (user_id, otp_hash, token_hash, method, expires_at) VALUES ($1, $2, 'otp_flow', 'otp', $3)",
      [userId, otpHash, expiresAt]
    );

    const html = getOTPTemplate(otp);
    await sendEmail(normalizedEmail, 'Your password reset code — Life Dashboard', html);

  } else if (method === 'link') {
    const rawToken = generateLinkToken();
    const tokenHash = await hashToken(rawToken);

    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, method, expires_at) VALUES ($1, $2, 'link', $3)",
      [userId, tokenHash, expiresAt]
    );

    const link = `${env.FRONTEND_URL}/reset-password?token=${rawToken}&uid=${userId}`;
    const html = getLinkTemplate(link);
    await sendEmail(normalizedEmail, 'Reset your Life Dashboard password', html);
  }

  return { message: successMsg };
};

const verifyOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase();
  const userResult = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (userResult.rows.length === 0) throw new AuthError('OTP has expired or is invalid', 400);

  const userId = userResult.rows[0].id;

  const tokenResult = await db.query(
    "SELECT id, otp_hash FROM password_reset_tokens WHERE user_id = $1 AND method = 'otp' AND used = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [userId]
  );

  if (tokenResult.rows.length === 0) throw new AuthError('OTP has expired or is invalid', 400);

  const tokenRec = tokenResult.rows[0];
  const isValid = await compareToken(otp, tokenRec.otp_hash);

  if (!isValid) throw new AuthError('OTP has expired or is invalid', 400);

  const resetToken = signResetToken({ userId, purpose: 'password_reset' }, '5m');
  return { resetToken };
};

const validateResetLink = async (rawToken, uid) => {
  const tokenResult = await db.query(
    "SELECT id, token_hash FROM password_reset_tokens WHERE user_id = $1 AND method = 'link' AND used = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [uid]
  );

  if (tokenResult.rows.length === 0) throw new AuthError('Link expired or invalid', 400);

  const tokenRec = tokenResult.rows[0];
  const isValid = await compareToken(rawToken, tokenRec.token_hash);

  if (!isValid) throw new AuthError('Link expired or invalid', 400);

  const resetToken = signResetToken({ userId: uid, purpose: 'password_reset' }, '5m');
  return { resetToken };
};

const resetPassword = async (resetToken, newPassword) => {
  try {
    const decoded = verifyResetToken(resetToken);
    if (decoded.purpose !== 'password_reset') throw new Error();

    const userId = decoded.userId;
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    await db.query('UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false', [userId]);

    return { message: 'Password updated successfully. Please log in.' };
  } catch (err) {
    throw new AuthError('Invalid or expired reset session', 400);
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
