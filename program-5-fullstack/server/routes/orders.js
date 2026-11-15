const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/Food');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Place an order. Body: { items: [{ foodId, quantity }] }
// Prices come from the database, never from the client.
router.post('/', auth, async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'items must be a non-empty array' });

  // Validate each line and merge duplicate foods
  const quantities = {};
  for (const item of items) {
    if (!item || !mongoose.isValidObjectId(item.foodId))
      return res.status(400).json({ error: 'Each item needs a valid foodId' });
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)
      return res.status(400).json({ error: 'quantity must be a whole number between 1 and 20' });
    quantities[item.foodId] = (quantities[item.foodId] || 0) + item.quantity;
  }

  const foods = await Food.find({ _id: { $in: Object.keys(quantities) } });
  if (foods.length !== Object.keys(quantities).length)
    return res.status(404).json({ error: 'One or more food items no longer exist' });

  const orderItems = foods.map((f) => ({
    food: f._id,
    name: f.name,
    price: f.price,
    quantity: quantities[f._id],
  }));
  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({ user: req.user.id, items: orderItems, total });
  res.status(201).json(order);
});

// Orders of the logged-in user, newest first
router.get('/', auth, async (req, res) => {
  res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
});

module.exports = router;
