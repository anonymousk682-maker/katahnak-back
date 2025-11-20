const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/token');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/admin/login', async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000*60*60*24*7
    });

    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/admin/logout', (req,res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});


router.get('/admin/me', auth, async (req, res) => {
  try {
    // req.user is coming from the auth middleware (decoded JWT)
    const user = await User.findById(req.user._id).select('_id username email');

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({ user });
  } catch (err) {
    console.error('GET /admin/me error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


