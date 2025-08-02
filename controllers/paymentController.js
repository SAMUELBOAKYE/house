const axios = require("axios");
const Booking = require("../models/Booking");

exports.initializePayment = async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "GHS",
        channels: ["mobile_money"],
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("âŒ Payment initialization error:", err.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

exports.verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = response.data;

    if (data.status !== "success") {
      return { success: false, message: "Payment not successful" };
    }

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
        : "Other";

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

    let booking = await Booking.findOne({ transactionId: data.reference });

    if (!booking) {
      booking = new Booking(bookingData);
      await booking.save();
      console.log(`âœ… New booking saved for: ${data.reference}`);
    } else {
      booking.status = "completed";
      await booking.save();
      console.log(`ðŸ”„ Existing booking updated: ${data.reference}`);
    }

    return { success: true, booking };
  } catch (err) {
    console.error("âŒ Payment verification error:", err.message);
    return { success: false, message: err.message };
  }
};

