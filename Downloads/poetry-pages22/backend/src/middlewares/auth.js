// backend/src/middlewares/auth.js
const { verifyToken } = require('../utils/token');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyToken(token, process.env.JWT_SECRET);

    // Accept either payload._id (preferred) or payload.id (legacy)
    const userId = payload?._id || payload?.id;
    if (!userId) {
      console.warn('Auth middleware: token payload missing id/_id', { payload });
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (err) {
    console.error('auth middleware error', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
