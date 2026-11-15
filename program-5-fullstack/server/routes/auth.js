const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const isText = (v) => typeof v === 'string' && v.trim() !== '';

// Express 5 forwards errors from async handlers to the error middleware automatically.
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!isText(name)) return res.status(400).json({ error: 'name is required' });
  if (!isText(email) || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: 'A valid email is required' });
  if (!isText(password) || password.length < 6)
    return res.status(400).json({ error: 'password must be at least 6 characters' });

  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ error: 'Email already registered' });

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isText(email) || !isText(password))
    return res.status(400).json({ error: 'email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user._id, name: user.name, email: user.email });
});

module.exports = router;
