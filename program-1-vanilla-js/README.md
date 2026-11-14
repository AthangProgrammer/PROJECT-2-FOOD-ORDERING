# Program 1 – Online Food Ordering System

A responsive, beginner-friendly Online Food Ordering web application built using **HTML5**, **CSS3**, and **Vanilla JavaScript**. This project serves as **Program 1** of the Full Stack Development laboratory assignments for **Project 2: Online Food Ordering System**.

---

## 📋 Table of Contents
- [Objective](#-objective)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Technical Architecture](#-technical-architecture)
- [HTTP Methods & JSON Handling](#-http-methods--json-handling)
- [Prerequisites & Setup](#-prerequisites--setup)
- [How to Run the Application](#-how-to-run-the-application)
- [Automated Testing & Verification](#-automated-testing--verification)
- [Feature Walkthrough & UI Guide](#-feature-walkthrough--ui-guide)
- [College Viva / Practical Q&A](#-college-viva--practical-qa)
- [Project Roadmap](#-project-roadmap)

---

## 🎯 Objective
To construct an interactive, single-page online food ordering frontend without relying on UI frameworks (such as React or Angular) or backend server engines (such as Express). It demonstrates:
1. Asynchronous data loading using the **Fetch API** with `async/await` from a structured JSON file.
2. Dynamic DOM creation and event-driven rendering.
3. Multi-criteria filtering, real-time searching, and price sorting.
4. Client-side shopping cart state management with quantity adjustments, item removal, and live subtotal/tax/delivery computations.
5. Form validation with inline feedback before checkout.
6. Order placement dispatching a prepared HTTP `POST` request with JSON payload handling, followed by order confirmation and a real-time status tracker.

---

## ✨ Key Features
1. **Dynamic Food Catalog Display:**
   - Asynchronously loads 12 food items across multiple categories (Pizza, Burgers, Pasta, Beverages, Desserts) from `data/foods.json`.
   - Displays food card with high-resolution imagery, dish title, detailed description, category badge, vegetarian/non-vegetarian badge, star rating, estimated prep time, formatted price, and an **Add to Cart** button.
   - Built-in SVG placeholder image fallback in case of network disruptions.
2. **Real-Time Name & Keyword Search:**
   - Instant search input matching dish names and descriptions case-insensitively.
   - Displays real-time matching counter (e.g., *"Showing 3 of 12 dishes"*).
   - Dedicated clear button (`×`) and helpful empty state if no dishes match.
3. **Category Filtering:**
   - Dropdown selection plus interactive quick-filter pills (All, Pizza, Burgers, Pasta, Beverages, Desserts).
   - Dynamically synchronized with catalog data.
4. **Price & Rating Sorting:**
   - Sort items by:
     - *Featured / Default*
     - *Price: Low to High*
     - *Price: High to Low*
     - *Rating: Highest First*
     - *Name: A to Z*
5. **Interactive Shopping Cart:**
   - Slide-in side drawer with darkened backdrop and smooth CSS animation.
   - Live badge counters in header navigation and hero banner.
   - LocalStorage persistence so cart contents remain intact across browser refreshes.
6. **Quantity Updates & Price Calculation:**
   - Increment (`+`), decrement (`-`), and delete actions.
   - Real-time computation of **Subtotal**, **Tax / GST (5%)**, **Delivery Fee** (Free for orders $25.00 and above, otherwise $2.99), and **Grand Total**.
7. **Checkout Form with Basic Validation:**
   - Customer Full Name (minimum 2 characters, alphabetic characters).
   - Phone Number (valid 10-digit validation).
   - Delivery Address (minimum 10 characters for complete address).
   - Optional delivery instructions note.
   - Payment method selection (Cash on Delivery, Credit/Debit Card, UPI).
   - Clear red border highlights and descriptive inline error messages.
8. **Order Confirmation & Live Order Tracker:**
   - Generates unique reference code (e.g., `#ORD-2026-8341`).
   - Displays itemized order receipt, customer info, and total bill.
   - Interactive 4-step order tracker:
     1. *Order Received* (25%)
     2. *Preparing Food* (50%)
     3. *Out for Delivery* (75%)
     4. *Delivered Warm!* (100%)
   - Demo button to advance order status interactively during lab evaluations.
9. **Fetch API with `async/await`:**
   - Modern, readable asynchronous JavaScript code.
   - Proper `try...catch` block handling with user-facing loading spinners and error banners.
10. **Appropriate HTTP Methods & JSON Request Handling:**
    - **GET**: Used to fetch `data/foods.json` and parse the JSON response.
    - **POST**: Dispatches a prepared `POST` request with headers `Content-Type: application/json` and `JSON.stringify(orderPayload)` to the backend endpoint (`http://localhost:5000/api/orders`).
    - *Client Simulation Fallback*: When the backend is offline (normal in Program 1), catches the network error gracefully, informs the user with a transparent notice, and simulates the order locally.

---

## 📂 Project Structure
```text
PROJECT-2-FOOD-ORDERING/program-1-vanilla-js/
├── index.html                   # Semantic HTML5 single-page structure
├── css/
│   └── style.css                # Custom responsive CSS3 styling & animations
├── js/
│   └── app.js                   # Application logic (Fetch API, Cart state, Validation)
├── data/
│   └── foods.json               # Food catalog JSON database (12 items)
├── tests/
│   └── verify-food-ordering.test.js # Automated verification suite (JSDOM)
├── package.json                 # Project manifest & dev scripts (Vite, JSDOM)
└── README.md                    # Project documentation & viva guide
```

---

## 🛠️ Technical Architecture

### 1. Separation of Concerns
- **HTML (`index.html`)**: Semantic structure using `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, and modal dialogs.
- **CSS (`css/style.css`)**: Pure CSS variables (`--primary`, `--secondary`, `--bg-main`), Flexbox, CSS Grid layouts, and mobile-first responsive media queries.
- **JavaScript (`js/app.js`)**: Encapsulated state management, DOM caching, event delegation, and asynchronous HTTP calls.

### 2. State Architecture
```javascript
const state = {
  foods: [],            // Catalog loaded from foods.json
  cart: [],             // Active shopping cart items
  searchQuery: '',      // Active text search query
  selectedCategory: 'all', // Active category filter
  selectedSort: 'default', // Active sort order
  currentOrder: null,   // Active submitted order
  orderStatusStep: 1    // Step 1 to 4 for live delivery tracker
};
```

---

## 🌐 HTTP Methods & JSON Handling

| Operation | HTTP Method | Endpoint / Resource | Headers | Body / Payload | Description |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Fetch Menu** | `GET` | `data/foods.json` | Default | None | Fetches JSON food catalog asynchronously via Fetch API |
| **Place Order** | `POST` | `http://localhost:5000/api/orders` | `Content-Type: application/json` | JSON stringified Order Payload | Dispatches structured order data with customer & cart info |

### Sample JSON Order Payload (Dispatched via POST)
```json
{
  "orderId": "ORD-2026-4819",
  "timestamp": "2026-11-15T01:10:00.000Z",
  "customer": {
    "name": "Alex Johnson",
    "phone": "9876543210",
    "address": "Apartment 4B, 124 Baker Street, Downtown",
    "notes": "Please leave at door and ring bell"
  },
  "items": [
    {
      "id": 1,
      "name": "Margherita Classic Pizza",
      "category": "Pizza",
      "price": 12.99,
      "quantity": 2,
      "itemTotal": 25.98
    }
  ],
  "pricing": {
    "subtotal": 25.98,
    "deliveryFee": 0.00,
    "tax": 1.30,
    "grandTotal": 27.28
  },
  "paymentMethod": "COD",
  "status": "Confirmed"
}
```

> [!NOTE]
> **Program 1 Architecture Notice:**
> In this first program, the backend server (Node.js/Express) is not yet active. When the `POST` request is sent, the code catches the network error, provides a transparent status banner, and smoothly transitions to the Order Confirmation and Live Tracking UI. The backend database persistence will be implemented in subsequent programs (Program 3 & 4).

---

## 💻 Prerequisites & Setup

### Requirements
- **Web Browser**: Chrome, Firefox, Edge, or Safari (modern version with ES6+ support).
- **Node.js** (Optional, recommended for local dev server & automated test runner): Node 18+.

---

## 🚀 How to Run the Application

Because the application uses the modern `Fetch API` to asynchronously load `data/foods.json`, the browser requires the page to be served through an HTTP server (to adhere to browser CORS and local file security policies).

### Method 1: Using Vite (Included in package.json)
```bash
# Navigate to project folder
cd PROJECT-2-FOOD-ORDERING/program-1-vanilla-js

# Install dependencies
npm install

# Start development server
npm run dev
```
Open the local URL displayed in the terminal (usually `http://localhost:5173/`).

### Method 2: Using VS Code Live Server
1. Open the folder `PROJECT-2-FOOD-ORDERING/program-1-vanilla-js` in VS Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.
3. The website will open at `http://127.0.0.1:5500/index.html`.

### Method 3: Using Python Built-in HTTP Server
```bash
cd PROJECT-2-FOOD-ORDERING/program-1-vanilla-js
python -m http.server 8000
```
Open `http://localhost:8000/` in your browser.

### Method 4: Using Node `npx serve`
```bash
cd PROJECT-2-FOOD-ORDERING/program-1-vanilla-js
npx serve .
```

---

## 🧪 Automated Testing & Verification

An automated test suite using **JSDOM** is provided to verify all 10 core requirements:

```bash
cd PROJECT-2-FOOD-ORDERING/program-1-vanilla-js
npm test
```

### Test Coverage Breakdown
- **Test Suite 1:** Initial Food Catalog Rendering & Fetch API `GET` execution.
- **Test Suite 2:** Real-time search by food name & empty search handling.
- **Test Suite 3:** Category dropdown & category pills filtering.
- **Test Suite 4:** Sort food items by price (Low to High, High to Low).
- **Test Suite 5:** Shopping cart addition & header badge increment.
- **Test Suite 6:** Quantity updates (`+` / `-`), subtotal, free delivery threshold, tax, and grand total calculations.
- **Test Suite 7:** Checkout form validation (Name, Phone, Address error states).
- **Test Suite 8:** Prepared HTTP `POST` dispatch with correct headers & JSON payload.
- **Test Suite 9:** Order Confirmation modal & live status step progression.

---

## 📸 Feature Walkthrough & UI Guide

### 1. Menu Browsing & Filters
- Use the search bar to find dishes by name or description.
- Click category pills (e.g. *Pizza*, *Burgers*) or use the Category dropdown.
- Select *Price: Low to High* to find budget-friendly items.

### 2. Cart Management
- Click **"+ Add to Cart"** on any food card.
- Click the **Cart** button in the header or hero banner to open the sliding drawer.
- Use `+` and `-` buttons to adjust servings, or click **Remove** to delete an item.
- Note how orders of $25 or more automatically receive **FREE Delivery**!

### 3. Checkout & Validation
- Click **"Proceed to Checkout →"** from the cart drawer.
- Try submitting without typing to observe the red validation errors.
- Enter a name (min 2 chars), 10-digit phone number, and street address.
- Select your preferred payment method (Cash on Delivery, Card, or UPI).

### 4. Order Confirmation & Tracking
- Click **"Place Order & Pay"**.
- View your unique Order Reference ID and itemized bill.
- Click **"⏩ Advance Status (Demo)"** to see the order progress from *Order Received* → *Preparing Food* → *Out for Delivery* → *Delivered Warm!*.

---

## 🎓 College Viva / Practical Q&A

### Q1: Why do we use `async/await` with the `Fetch API` instead of synchronous code?
> **Answer:** Network operations are asynchronous. If we fetched data synchronously, the browser execution would freeze and become unresponsive while waiting for the network. `async/await` provides clean, non-blocking asynchronous syntax that reads like synchronous code while letting the browser stay responsive.

### Q2: What is the difference between `GET` and `POST` methods here?
> **Answer:**
> - `GET` is used to retrieve data from a resource (e.g., retrieving `data/foods.json`). It is idempotent and has no request body.
> - `POST` is used to send data to a server to create a resource (e.g., submitting an order). It includes a request body (`JSON.stringify(orderPayload)`) and a `Content-Type: application/json` header.

### Q3: Why is an HTTP server needed to view the project instead of double-clicking `index.html`?
> **Answer:** Modern browsers enforce the **Same-Origin Policy** (CORS) which blocks `fetch()` requests on local `file:///` URLs for security reasons. Serving the folder via an HTTP server (e.g. Vite, Live Server, Python) provides an `http://` origin so `fetch('data/foods.json')` can succeed.

### Q4: How does event delegation improve performance in the food catalog?
> **Answer:** Instead of binding click event listeners to dozens of individual "Add to Cart" or quantity buttons, a single event listener is attached to the parent container (`#foodContainer` or `#cartItemsList`). Using `e.target.closest('[data-action="..."]')`, events bubble up to the parent, reducing memory usage and simplifying dynamic DOM additions.

### Q5: How is form validation implemented?
> **Answer:** Validation runs purely on the client side using JavaScript regular expressions and string checks. If an input fails validation, CSS classes (`is-invalid`) and visible error text (`.field-error`) are applied, and `event.preventDefault()` blocks form submission until errors are resolved.

---

## 🗺️ Project Roadmap
- **Program 1 (Current):** Vanilla HTML5, CSS3, and JavaScript Single Page App with Fetch API and client state.
- **Program 2:** React-based single-page component architecture with React Hooks and Context API.
- **Program 3:** Node.js backend server with raw HTTP module and REST API endpoints.
- **Program 4:** Express.js RESTful API with routing, middleware, and controllers.
- **Program 5:** Full Stack integrated application combining React frontend with Express/MongoDB backend.

---

**Developed for Full Stack Development Lab &bull; Academic Year 2026**
