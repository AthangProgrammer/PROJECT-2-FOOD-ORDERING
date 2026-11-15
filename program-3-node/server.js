// Food Ordering API - built-in Node.js modules only (http, fs, path, events)
const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const PORT = 3000;
const FOODS_FILE = path.join(__dirname, 'data', 'foods.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// EventEmitter: fires "orderPlaced" whenever a new order is saved
const events = new EventEmitter();
events.on('orderPlaced', (order) => {
  console.log(`[event] New order #${order.id} for ${order.customer} (total ${order.total})`);
});

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

// Read request body as a stream, then parse JSON
function readBody(req, callback) {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 1e6) req.destroy(); // ponytail: crude 1MB cap
  });
  req.on('end', () => {
    try {
      callback(null, JSON.parse(raw));
    } catch {
      callback(new Error('Invalid JSON'));
    }
  });
}

// Returns an error message, or null if the order is valid
function validateOrder(o, foods) {
  if (!o || typeof o !== 'object') return 'Body must be a JSON object';
  if (typeof o.customer !== 'string' || !o.customer.trim()) return 'customer is required';
  if (!Array.isArray(o.items) || o.items.length === 0) return 'items must be a non-empty array';
  for (const item of o.items) {
    if (!item || !foods.some((f) => f.id === item.foodId)) return `Unknown foodId: ${item && item.foodId}`;
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return 'quantity must be a positive integer';
  }
  return null;
}

const server = http.createServer((req, res) => {
  try {
    const { method } = req;
    const url = req.url.split('?')[0];

    if (url === '/api/foods' && method === 'GET') {
      return send(res, 200, readJson(FOODS_FILE));
    }

    if (url === '/api/orders' && method === 'GET') {
      return send(res, 200, readJson(ORDERS_FILE));
    }

    if (url === '/api/orders' && method === 'POST') {
      return readBody(req, (err, body) => {
        try {
          if (err) return send(res, 400, { error: err.message });
          const foods = readJson(FOODS_FILE);
          const problem = validateOrder(body, foods);
          if (problem) return send(res, 400, { error: problem });

          const orders = readJson(ORDERS_FILE);
          const total = body.items.reduce(
            (sum, i) => sum + foods.find((f) => f.id === i.foodId).price * i.quantity, 0);
          const order = {
            id: orders.length ? orders[orders.length - 1].id + 1 : 1,
            customer: body.customer.trim(),
            items: body.items.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
            total: Math.round(total * 100) / 100,
            createdAt: new Date().toISOString(),
          };
          orders.push(order);
          writeJson(ORDERS_FILE, orders);
          events.emit('orderPlaced', order);
          send(res, 201, order);
        } catch (e) {
          console.error(e);
          send(res, 500, { error: 'Internal server error' });
        }
      });
    }

    // Known path, wrong method
    if (url === '/api/foods' || url === '/api/orders') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    send(res, 404, { error: 'Route not found' });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
