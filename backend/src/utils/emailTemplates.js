const getOTPTemplate = (otp) => `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">🌟 Life Dashboard</h2>
    <p style="color: #374151; font-size: 16px; line-height: 1.5;">You requested a password reset for your Life Dashboard account.</p>
    <div style="margin: 32px 0; text-align: center;">
      <span style="display: inline-block; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 12px; font-family: monospace; background-color: #f3f4f6; border: 2px dashed #4f46e5; border-radius: 8px; color: #111827;">${otp}</span>
    </div>
    <p style="color: #6b7280; font-size: 14px; text-align: center;">This code expires in 15 minutes.</p>
    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; 2025 Life Dashboard &mdash; This is an automated message, do not reply.</p>
  </div>
</body>
</html>
`;

const getLinkTemplate = (link) => `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">🌟 Life Dashboard</h2>
    <p style="color: #374151; font-size: 16px; line-height: 1.5;">Click the button below to reset your password.</p>
    <div style="margin: 32px 0; text-align: center;">
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 16px;">Reset My Password</a>
    </div>
    <p style="color: #6b7280; font-size: 14px; text-align: center;">This link expires in 15 minutes and can only be used once.</p>
    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; 2025 Life Dashboard &mdash; This is an automated message, do not reply.</p>
  </div>
</body>
</html>
`;

module.exports = {
    getOTPTemplate,
    getLinkTemplate
};
