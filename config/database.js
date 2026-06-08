const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27000/timeline_db'; 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected successfully...");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;