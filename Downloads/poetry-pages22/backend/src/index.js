require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/adminPoems');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// DB connect
connectDB(process.env.MONGO_URI).catch(err => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: ["https://katahnak-back.vercel.app/", "*"]
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// routes
app.use('/api', publicRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

// error handler (after routes)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
