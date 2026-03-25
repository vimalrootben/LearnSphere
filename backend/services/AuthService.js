const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate a 6-digit numeric OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Create Nodemailer transporter using Gmail SMTP
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'LEARNSPHERE <no-reply@learnsphere.ai>',
    to: email,
    subject: '🎓 Your LEARNSPHERE Login OTP',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin:0; font-size: 26px; color: #fff;">🌐 LEARNSPHERE</h1>
          <p style="margin:4px 0 0; color: #bfdbfe; font-size: 14px;">Smart Personalized Learning</p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="font-size: 16px; color: #94a3b8;">Your One-Time Password is:</p>
          <div style="font-size: 42px; font-weight: bold; letter-spacing: 10px; color: #60a5fa; margin: 16px 0;">${otp}</div>
          <p style="font-size: 13px; color: #64748b;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <div style="padding: 16px; text-align: center; background: #1e293b; font-size: 11px; color: #475569;">
          © 2025 LEARNSPHERE. All rights reserved.
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };
