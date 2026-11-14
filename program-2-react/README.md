# Program 2 – React Application
## Project 2: Online Food Ordering System

A beginner-friendly React application built with **React 18**, **Vite**, and **React Router v6**.

---

## Features

| Requirement | Implementation |
|---|---|
| Reusable functional components | `Navbar`, `FoodCard`, `FoodList`, `FoodEntryForm` |
| Food entry form | Name, description, category (dropdown), price |
| Food listing view | Responsive card grid with live search |
| Props | Data flows `App → FoodListingPage → FoodList → FoodCard` |
| `useState` | Form inputs, food items list, errors, success banner |
| `useEffect` | Updates browser tab title on each page |
| Conditional rendering | Empty-state, search no-results, inline errors, success banner |
| Event handling | `onChange`, `onSubmit`, search input, reset button |
| React Router | `/` listing page · `/add` entry page · `*` 404 page |
| Form validation | Required fields, min-length, positive price, real-time error clearing |

---

## Project Structure

```
program-2-react/
├── index.html                    # Vite entry HTML
├── vite.config.js                # Vite + React plugin (port 5175)
├── package.json
└── src/
    ├── main.jsx                  # ReactDOM.createRoot + BrowserRouter
    ├── App.jsx                   # Root: state + Routes
    ├── index.css                 # Global styles (CSS variables, responsive)
    ├── data/
    │   └── initialFoodItems.js   # 5 seed food items
    ├── components/
    │   ├── Navbar.jsx            # Fixed top navbar with NavLink
    │   ├── FoodCard.jsx          # Single food item display card
    │   ├── FoodList.jsx          # Grid of FoodCard; empty-state handling
    │   └── FoodEntryForm.jsx     # Controlled form with validation
    └── pages/
        ├── FoodListingPage.jsx   # Route "/" – search + FoodList
        ├── FoodEntryPage.jsx     # Route "/add" – FoodEntryForm wrapper
        └── NotFoundPage.jsx      # Route "*" – 404 fallback
```

---

## How to Run

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Navigate to this directory
cd PROJECT-2-FOOD-ORDERING/program-2-react

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app opens automatically at **http://localhost:5175**

### Other Commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Food Listing | Shows all food items in a card grid with a live search bar |
| `/add` | Add Food Item | Form to add a new dish; redirects to listing on success |
| `*` | 404 | Friendly not-found page |

---

## React Concepts Demonstrated

### `useState`
- `foodItems` array in `App.jsx` – the single source of truth for all items
- `formData` object in `FoodEntryForm.jsx` – controlled input state
- `errors` object in `FoodEntryForm.jsx` – per-field validation messages
- `submitSuccess` flag in `FoodEntryForm.jsx` – success banner toggle
- `searchTerm` string in `FoodListingPage.jsx` – live filtering

### `useEffect`
- `FoodListingPage.jsx` – syncs the browser tab title with the item count
- `FoodEntryPage.jsx` – sets a custom title when the add-form page is active
- Both effects return a cleanup function that restores the default title

### Props (data flow)
```
App (state: foodItems)
 └─ FoodListingPage  ← foodItems
     └─ FoodList     ← foodItems, searchTerm
         └─ FoodCard ← food (single item)

App (callback: handleAddFoodItem)
 └─ FoodEntryPage   ← onAddFoodItem
     └─ FoodEntryForm ← onAddFoodItem
```

### Conditional Rendering
- Empty food list → illustrated empty-state message
- No search results → "no results" message
- Per-field validation errors → `{errors.name && <span>…</span>}`
- Success banner after submission → `{submitSuccess && <div>…</div>}`
- Search clear button → only visible when `searchTerm` is non-empty

### Form Validation Rules
| Field | Rules |
|---|---|
| Name | Required · minimum 2 characters |
| Description | Required · minimum 10 characters |
| Category | Must select one from the dropdown |
| Price | Required · positive number · less than \₹99,999 |

Errors clear in real time as the user corrects each field.

---

## Design

- CSS custom properties (variables) for the colour palette
- Fixed top navbar with active-route highlighting via `NavLink`
- Responsive CSS Grid (`auto-fill` + `minmax`) for the food card layout
- Mobile-first with `@media (max-width: 600px)` overrides
- Hover effects on cards and buttons
- Smooth fade-in animation on the success banner
