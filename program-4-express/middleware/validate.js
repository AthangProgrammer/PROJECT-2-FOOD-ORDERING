// Validation middleware: respond 400 if the body is bad
const bad = (res, msg) => res.status(400).json({ error: msg });

exports.validateFood = (req, res, next) => {
  const { name, price } = req.body;
  if (typeof name !== 'string' || !name.trim()) return bad(res, 'name is required');
  if (typeof price !== 'number' || price <= 0) return bad(res, 'price must be a number > 0');
  next();
};

exports.validateOrder = (req, res, next) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return bad(res, 'items must be a non-empty array');
  for (const i of items) {
    if (!i || !Number.isInteger(i.foodId)) return bad(res, 'each item needs an integer foodId');
    if (!Number.isInteger(i.quantity) || i.quantity < 1) return bad(res, 'quantity must be a positive integer');
  }
  next();
};

exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || !name.trim()) return bad(res, 'name is required');
  if (typeof email !== 'string' || !email.includes('@')) return bad(res, 'valid email is required');
  if (typeof password !== 'string' || password.length < 6) return bad(res, 'password must be at least 6 characters');
  next();
};
