const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { validateOrder } = require('../middleware/validate');

router.use(auth); // every order route needs a login token

// Checks foodIds exist and adds up the total. Returns { total } or { error }.
function priceItems(items) {
  const foods = db.read('foods');
  let total = 0;
  for (const i of items) {
    const food = foods.find((f) => f.id === i.foodId);
    if (!food) return { error: `Unknown foodId: ${i.foodId}` };
    total += food.price * i.quantity;
  }
  return { total: Math.round(total * 100) / 100 };
}

const cleanItems = (items) => items.map(({ foodId, quantity }) => ({ foodId, quantity }));

// Users only see/change their own orders
const mine = (req) => db.read('orders').filter((o) => o.userId === req.user.id);

router.get('/', (req, res) => res.json(mine(req)));

router.get('/:id', (req, res) => {
  const order = mine(req).find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/', validateOrder, (req, res) => {
  const { total, error } = priceItems(req.body.items);
  if (error) return res.status(400).json({ error });
  const orders = db.read('orders');
  const order = {
    id: db.nextId(orders),
    userId: req.user.id,
    items: cleanItems(req.body.items),
    total,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  db.write('orders', orders);
  res.status(201).json(order);
});

router.put('/:id', validateOrder, (req, res) => {
  const orders = db.read('orders');
  const order = orders.find((o) => o.id === Number(req.params.id) && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { total, error } = priceItems(req.body.items);
  if (error) return res.status(400).json({ error });
  order.items = cleanItems(req.body.items);
  order.total = total;
  if (typeof req.body.status === 'string') order.status = req.body.status;
  db.write('orders', orders);
  res.json(order);
});

router.delete('/:id', (req, res) => {
  const orders = db.read('orders');
  const left = orders.filter((o) => !(o.id === Number(req.params.id) && o.userId === req.user.id));
  if (left.length === orders.length) return res.status(404).json({ error: 'Order not found' });
  db.write('orders', left);
  res.json({ message: 'Order deleted' });
});

module.exports = router;
