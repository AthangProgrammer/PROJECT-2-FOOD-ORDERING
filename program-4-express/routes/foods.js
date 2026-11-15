const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { validateFood } = require('../middleware/validate');

router.get('/', (req, res) => res.json(db.read('foods')));

router.get('/:id', (req, res) => {
  const food = db.read('foods').find((f) => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ error: 'Food not found' });
  res.json(food);
});

// Writes need a login token
router.post('/', auth, validateFood, (req, res) => {
  const foods = db.read('foods');
  const food = { id: db.nextId(foods), name: req.body.name.trim(), price: req.body.price };
  foods.push(food);
  db.write('foods', foods);
  res.status(201).json(food);
});

router.put('/:id', auth, validateFood, (req, res) => {
  const foods = db.read('foods');
  const food = foods.find((f) => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ error: 'Food not found' });
  food.name = req.body.name.trim();
  food.price = req.body.price;
  db.write('foods', foods);
  res.json(food);
});

router.delete('/:id', auth, (req, res) => {
  const foods = db.read('foods');
  const left = foods.filter((f) => f.id !== Number(req.params.id));
  if (left.length === foods.length) return res.status(404).json({ error: 'Food not found' });
  db.write('foods', left);
  res.json({ message: 'Food deleted' });
});

module.exports = router;
