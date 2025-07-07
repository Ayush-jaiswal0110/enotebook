const mongoose = require("mongoose");
require('dotenv').config(); // ✅ Load .env variables early


const MONGO_URI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // exit app if DB fails
  }
};

module.exports = connectToMongo;
