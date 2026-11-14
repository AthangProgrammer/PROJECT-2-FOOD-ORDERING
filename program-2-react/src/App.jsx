import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import FoodListingPage from './pages/FoodListingPage.jsx';
import FoodEntryPage from './pages/FoodEntryPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import initialFoodItems from './data/initialFoodItems.js';

/**
 * App – root component.
 *
 * State lives here so both pages share the same food items list.
 * We pass items down to FoodListingPage and an addItem callback
 * down to FoodEntryPage via props.
 */
function App() {
  // ----- state -----
  const [foodItems, setFoodItems] = useState(initialFoodItems);

  // Called by FoodEntryPage when the user successfully submits a new item
  function handleAddFoodItem(newItem) {
    setFoodItems((prev) => [
      ...prev,
      { ...newItem, id: Date.now() }, // unique id using timestamp
    ]);
  }

  return (
    <div className="app">
      {/* Navbar is always visible */}
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Page 1 – view all food items */}
          <Route
            path="/"
            element={<FoodListingPage foodItems={foodItems} />}
          />

          {/* Page 2 – add a new food item */}
          <Route
            path="/add"
            element={<FoodEntryPage onAddFoodItem={handleAddFoodItem} />}
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>© 2024 FoodHub – Online Food Ordering System</p>
      </footer>
    </div>
  );
}

export default App;
