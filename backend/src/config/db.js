const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skill_mock_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}).`);
    console.log(`⚡ Seamless Fallback: Active embedded persistent JSON storage mode.`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
