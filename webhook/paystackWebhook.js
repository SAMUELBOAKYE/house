const express = require("express");
const crypto = require("crypto");
const Booking = require("../models/Booking");

const router = express.Router();

const verifyPaystackSignature = (req, res, next) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");

    const paystackSignature = req.headers["x-paystack-signature"];

    if (hash === paystackSignature) {
      next();
    } else {
      console.error(" Invalid Paystack signature");
      res.status(401).send("Unauthorized: Invalid signature");
    }
  } catch (err) {
    console.error(" Signature verification error:", err.message);
    res.status(400).send("Invalid request format");
  }
};

router.post("/", verifyPaystackSignature, async (req, res) => {
  try {
    const event = JSON.parse(req.body);

    if (event.event === "charge.success") {
      const { data } = event;

      if (data.status !== "success") {
        console.log(` Transaction ${data.reference} not successful`);
        return res.sendStatus(200);
      }

      const existing = await Booking.findOne({
        transactionId: data.reference,
      });

      const roomName =
        data.metadata?.custom_fields?.find(
          (f) => f.variable_name === "room_booked"
        )?.value || "Unknown Room";

      const phone =
        data.customer?.phone || data.authorization?.mobile_money_number || "";

      const network =
        data.authorization?.channel === "mobile_money"
          ? data.authorization?.provider?.charAt(0).toUpperCase() +
            data.authorization?.provider?.slice(1)
          : "Unknown";

      const bookingData = {
        roomName,
        phone,
        network,
        amount: data.amount / 100,
        transactionId: data.reference,
        status: "completed",
        paymentDate: data.paid_at || new Date(),
        customerEmail: data.customer?.email,
        reference: data.reference,
      };

      if (!existing) {
        const booking = new Booking(bookingData);
        await booking.save();
        console.log(` Webhook Booking saved: ${data.reference}`);
      } else if (existing.status !== "completed") {
        existing.status = "completed";
        await existing.save();
        console.log(` Webhook Booking updated: ${data.reference}`);
      } else {
        console.log(` Webhook Booking already completed: ${data.reference}`);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(" Webhook processing failed:", err.message);
    res.status(500).send("Webhook processing failed");
  }
});

module.exports = router;
