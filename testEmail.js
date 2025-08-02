// testEmail.js
require("dotenv").config();
const transporter = require("./utils/emailService");

const recipient = "boakyesamuel189@gmail.com";

transporter
  .sendMail({
    from: `"Quest Support" <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject: "ðŸ“¨ Test Email from Yafafa Backend",
    text: "âœ… This is a test email from your backend setup.",
  })
  .then(() => console.log("âœ… Test email sent successfully!"))
  .catch((err) => console.error("âŒ Email sending failed:", err.message));
