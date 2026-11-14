import { useState, useEffect } from 'react';
import FoodList from '../components/FoodList.jsx';

/**
 * FoodListingPage – shows all food items in a searchable grid.
 *
 * Props:
 *   foodItems – array of food objects from App state
 *
 * Demonstrates:
 *   - useEffect (update document title when item count changes)
 *   - useState (local search term)
 *   - Passing props down to FoodList
 */
function FoodListingPage({ foodItems }) {
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect: keep the browser tab title in sync with the item count
  useEffect(() => {
    document.title = `FoodHub – ${foodItems.length} item${foodItems.length !== 1 ? 's' : ''}`;

    // Cleanup: restore the default title when navigating away
    return () => {
      document.title = 'FoodHub – Online Food Ordering';
    };
  }, [foodItems.length]); // only re-run when the count changes

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">🍽️ Our Menu</h1>
        <p className="page-subtitle">
          {foodItems.length} item{foodItems.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search bar – only show when there are items */}
      {foodItems.length > 0 && (
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by name or category…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search food items"
          />
          {/* Show clear button only when there is text */}
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Food list – passes both items and search term down */}
      <FoodList foodItems={foodItems} searchTerm={searchTerm} />
    </div>
  );
}

export default FoodListingPage;
