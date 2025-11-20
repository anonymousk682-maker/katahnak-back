const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
    throw new Error("❌ MONGO_URI not found in .env file");
  }

  try {
     await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB connected');
  
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }

 
}

module.exports = connectDB;
