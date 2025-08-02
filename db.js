// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("âŒ MONGODB_URI not defined in .env file");
    }

    // âœ… Cleaned: Removed deprecated options
    await mongoose.connect(uri);

    console.log("âœ… MongoDB connected successfully");
  } catch (err) {
    console.error("âŒ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
