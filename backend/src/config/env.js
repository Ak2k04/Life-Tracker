require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM
};

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_RESET_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM'
];

requiredVars.forEach(key => {
  if (!env[key]) {
    console.warn(`Warning: Missing required environment variable: ${key}`);
  }
});

module.exports = env;
