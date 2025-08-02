// utils/emailService.js
const nodemailer = require("nodemailer");

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password, not your Gmail login password
  },
});

// Verify transporter (optional but helpful for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

/**
 * Send an email
 * @param {Object} param0
 * @param {string} param0.to - Recipient email address
 * @param {string} param0.subject - Subject line
 * @param {string} param0.html - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Quest Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`âœ… Email sent to ${to}`);
  } catch (err) {
    console.error("âŒ Failed to send email:", err);
    throw err;
  }
};

module.exports = {
  transporter,
  sendEmail,
};
