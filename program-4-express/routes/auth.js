const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');
const { validateRegister } = require('../middleware/validate');

router.post('/register', validateRegister, async (req, res) => {
  const { name, email, password } = req.body;
  const users = db.read('users');
  if (users.some((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = {
    id: db.nextId(users),
    name: name.trim(),
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10), // never store plain passwords
  };
  users.push(user);
  db.write('users', users);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = db.read('users').find((u) => u.email === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/me', auth, (req, res) => {
  const user = db.read('users').find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

module.exports = router;
