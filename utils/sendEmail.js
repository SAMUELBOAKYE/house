// backend/utils/sendSMS.js

const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS or WhatsApp message using Twilio
 *
 * @param {string} to - Phone number (e.g., +233541451661)
 * @param {string} body - The message content
 * @param {string} channel - "sms" or "whatsapp"
 */
const sendSMS = async (to, body, channel = "sms") => {
  try {
    const from =
      channel === "whatsapp"
        ? "whatsapp:+14155238886"
        : process.env.TWILIO_PHONE; // Your SMS-enabled Twilio number

    const message = await client.messages.create({
      body,
      from,
      to: channel === "whatsapp" ? `whatsapp:${to}` : to,
    });

    console.log(`✅ ${channel.toUpperCase()} sent:`, message.sid);
  } catch (err) {
    console.error(`❌ Failed to send ${channel}:`, err.message);
  }
};

module.exports = sendSMS;
