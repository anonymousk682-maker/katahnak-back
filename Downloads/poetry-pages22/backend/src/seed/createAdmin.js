require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');

async function create() {
  try {
    await connectDB(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const hash = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'arun',
      email: 'ak1577282@gmail.com',
      passwordHash: hash
    });
    console.log('Admin created: ak1577282@gmail.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

create();
