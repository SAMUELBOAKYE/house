const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/yafafaDB";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("âœ… MongoDB connected successfully to:", uri);
  } catch (err) {
    console.error("âŒ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

