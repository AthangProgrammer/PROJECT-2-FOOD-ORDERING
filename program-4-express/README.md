# Program 4 – Express Food Ordering API

Express REST API with JWT login. Data is stored in JSON files (`data/`), no database.

## Run
```
cd PROJECT-2-FOOD-ORDERING/program-4-express
npm install
copy .env.example .env      (Mac/Linux: cp .env.example .env)
npm start
```
Server: http://localhost:4000. Edit `.env` and set your own `JWT_SECRET`. Never commit `.env`.

## Endpoints
| Method | Route | Auth |
|---|---|---|
| POST | /api/auth/register | no |
| POST | /api/auth/login | no (returns `token`) |
| GET | /api/auth/me | yes |
| GET | /api/foods, /api/foods/:id | no |
| POST, PUT, DELETE | /api/foods, /api/foods/:id | yes |
| GET, POST | /api/orders | yes |
| GET, PUT, DELETE | /api/orders/:id | yes |

Protected routes need the header `Authorization: Bearer <token>`.
Users only see their own orders.

## Request bodies
```json
register: { "name": "Asha", "email": "asha@test.com", "password": "secret123" }
login:    { "email": "asha@test.com", "password": "secret123" }
food:     { "name": "Salad", "price": 4.5 }
order:    { "items": [{ "foodId": 1, "quantity": 2 }] }
```

## Status codes
200 OK, 201 created, 400 bad input, 401 not logged in / bad token, 404 not found, 409 email taken, 500 server error.

## Structure
`server.js` wires up `routes/` (foods, orders, auth) and `middleware/` (logger, auth, validate, errorHandler). `db.js` reads/writes the JSON files.
