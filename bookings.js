// routes/bookings.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

// ✅ Middleware: Token authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    console.warn("❌ Invalid token:", err.message);
    return res.status(403).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

// ✅ Middleware: Admin check
const isAdmin = (req, res, next) => {
  const adminEmails = ["boakyesamuel189@gmail.com"]; // Replace with real admin(s)
  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// ✅ GET /api/bookings/all - Admin only route
router.get("/all", authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({
      message: "Server error fetching bookings",
      error: err.message,
    });
  }
});

// ✅ Other protected routes can go here (e.g., create, update, delete)
router.post("/", authenticate, async (req, res) => {
  const {
    guestName,
    room,
    date,
    time,
    phone,
    customerEmail,
    network,
    amount,
    transactionId,
    status,
  } = req.body;

  if (
    !guestName ||
    !room ||
    !date ||
    !time ||
    !phone ||
    !customerEmail ||
    !network ||
    !amount ||
    !transactionId
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const booking = new Booking({
      guestName,
      room,
      date,
      time,
      phone,
      customerEmail,
      network,
      amount,
      transactionId,
      status: status || "pending",
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving booking", error: err.message });
  }
});

module.exports = router;
