# Program 5 – Full Stack Food Ordering App (FoodHub)

React (Vite) + Express + MongoDB (Mongoose). JWT login, bcryptjs password hashing.

```
program-5-fullstack/
  server/   Express API  (models, routes, middleware)
  client/   React app    (pages, components, AuthContext, CartContext, api.js)
```

## Prerequisites
Node.js 18+ and MongoDB running locally (default `mongodb://127.0.0.1:27017`). MongoDB Compass can be used to view the `foodordering` database.

## Run locally (two terminals)

**1. Backend**
```
cd PROJECT-2-FOOD-ORDERING/program-5-fullstack/server
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (Mac/Linux)
# edit .env: set JWT_SECRET to your own random string
npm run seed                  # optional: adds 6 sample food items
npm start                     # http://localhost:5000
```

**2. Frontend**
```
cd PROJECT-2-FOOD-ORDERING/program-5-fullstack/client
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (Mac/Linux)
npm run dev                   # http://localhost:5173
```

Check the API: http://localhost:5000/api/health

## Environment variables
| File | Variable | Meaning |
|---|---|---|
| server/.env | PORT | API port (5000) |
| | MONGO_URI | MongoDB connection string. **Exactly ONE `/` before the database name** |
| | JWT_SECRET | Secret used to sign tokens (keep private) |
| | CLIENT_URL | Allowed frontend origin(s) for CORS. Comma-separate several; spaces and trailing `/` are ignored |
| client/.env | VITE_API_URL | API base URL, e.g. `http://localhost:5000/api` |

`.env` files are git-ignored. Only the `.env.example` files (placeholders) are committed.

## How the app works
1. Browse the menu (loaded from MongoDB), search by text and filter by category.
2. Click **Add to Cart**. The cart is kept in React state (`CartContext`), so it resets on a page refresh.
3. Register and log in. Logged-in users can **Place Order**, add food items and see **My Orders**.
4. The server calculates the order total from the prices in the database. Prices sent by the browser are ignored.

## API
| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | /api/health | no | status + DB state |
| POST | /api/auth/register | no | `name`, `email`, `password` (min 6) |
| POST | /api/auth/login | no | returns `token` and `user` |
| GET | /api/auth/me | yes | current user |
| GET | /api/foods, /api/foods/:id | no | |
| POST | /api/foods | yes | `name`, `description`, `category`, `price` |
| PUT, DELETE | /api/foods/:id | yes | only the user who created the item (403 otherwise) |
| POST | /api/orders | yes | `{ "items": [{ "foodId": "...", "quantity": 2 }] }` |
| GET | /api/orders | yes | the logged-in user's orders, newest first |

Protected routes need `Authorization: Bearer <token>`.
Status codes: 200, 201, 400 (bad input or id), 401 (no/invalid token or login), 403 (not the owner), 404, 409 (email taken), 500.

## Models (Mongoose)
- **User**: name, email (unique), password (hash)
- **Food**: name, description, category, price, `createdBy` → User
- **Order**: `user` → User, `items` [ `food` → Food, name, price, quantity ], total, status (Pending / Preparing / Delivered)

Each order line copies the food's name and price at order time, so order history stays correct even if the food is later edited or deleted.

## How login works
Login returns a JWT. The React app stores it in `localStorage` (via `AuthContext`) and sends it in the `Authorization` header (`api.js`). The server's `middleware/auth.js` verifies it. Tokens expire after 1 hour.

## Deployment preparation (nothing is deployed)

**1. Database – MongoDB Atlas**
- Create a free M0 cluster and a database user (use a password with letters and digits only).
- Network Access: allow `0.0.0.0/0`.
- Connection string format (note the single `/` before `foodordering`):
  `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/foodordering?retryWrites=true&w=majority`

**2. Backend → Render** (Web Service)
- Root Directory: `program-5-fullstack/server` (include the project folder path if the repo root is above it)
- Build command: `npm install`   |   Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET` (long random value), `CLIENT_URL` (set to the Vercel URL after step 3). Render sets `PORT` itself.
- Check `https://<service>.onrender.com/api/health` and `/api/foods` (should return `[]`).

**3. Frontend → Vercel**
- Root Directory: `program-5-fullstack/client`, framework Vite
- Build command: `npm run build`   |   Output directory: `dist`
- Environment variable: `VITE_API_URL` = `https://<service>.onrender.com/api` (must end with `/api`). It is baked in at build time, so redeploy after changing it.
- `client/vercel.json` rewrites all routes to `index.html` so refreshing `/cart` or `/login` works.

**4. Finish** – set `CLIENT_URL` on Render to the exact Vercel URL (e.g. `https://your-app.vercel.app`), then wait for Render to redeploy.

## Troubleshooting
- **"Cannot reach the server" / CORS error:** `VITE_API_URL` is wrong or `CLIENT_URL` on Render doesn't match the Vercel URL.
- **500 "Invalid namespace" on Render:** `MONGO_URI` has a double `//` before the database name.
- **First request is slow on Render:** the free tier sleeps when idle; wait 30–60 seconds.
- **Logged in as someone else on localhost:** several local apps on `localhost:5173` share `localStorage`; click Logout.

## Known limitations
- Any logged-in user can add food items. Only the creator can edit or delete one.
- `PUT /api/foods/:id` exists, but the UI has no edit form (not required).
- The cart is not saved (resets on refresh). The order status is always "Pending" (no admin screen to change it).
- The token in `localStorage` is simple but not the most secure option.
