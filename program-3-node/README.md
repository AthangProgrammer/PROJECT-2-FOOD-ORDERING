# Program 3 – Native Node.js Food Ordering API

Plain Node.js (`http`, `fs`, `path`, `events`). No Express, no npm packages.

## Run
```
cd PROJECT-2-FOOD-ORDERING/program-3-node
node server.js
```
Server: http://localhost:3000

## Endpoints
| Method | Route | Result |
|---|---|---|
| GET | /api/foods | all foods (200) |
| GET | /api/orders | all orders (200) |
| POST | /api/orders | save order (201); 400 if invalid |

Other paths → 404, wrong method → 405, crashes → 500.

POST body:
```json
{ "customer": "Asha", "items": [{ "foodId": 1, "quantity": 2 }] }
```

## Try it
```
curl http://localhost:3000/api/foods
curl http://localhost:3000/api/orders
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "{\"customer\":\"Asha\",\"items\":[{\"foodId\":1,\"quantity\":2}]}"
```

## Notes
- Data lives in `data/foods.json` and `data/orders.json`.
- The request body is read as a stream; an `EventEmitter` logs an `orderPlaced` event for each new order.
