const express = require('express');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

const router = express.Router();

// Only these fields can be set from the request body
const pick = ({ name, description, category, price } = {}) => ({ name, description, category, price });

router.get('/', async (req, res) => {
  res.json(await Food.find().sort({ createdAt: -1 }));
});

router.get('/:id', async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ error: 'Food item not found' });
  res.json(food);
});

// Creating, updating and deleting need a logged-in user
router.post('/', auth, async (req, res) => {
  const food = await Food.create({ ...pick(req.body), createdBy: req.user.id });
  res.status(201).json(food);
});

router.put('/:id', auth, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ error: 'Food item not found' });
  if (String(food.createdBy) !== req.user.id)
    return res.status(403).json({ error: 'You can only edit your own food items' });

  food.set(pick(req.body));
  await food.save(); // runs the schema validation
  res.json(food);
});

router.delete('/:id', auth, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ error: 'Food item not found' });
  if (String(food.createdBy) !== req.user.id)
    return res.status(403).json({ error: 'You can only delete your own food items' });

  await food.deleteOne();
  res.json({ message: 'Food item deleted' });
});

module.exports = router;
