import { useEffect } from 'react';
import FoodEntryForm from '../components/FoodEntryForm.jsx';

/**
 * FoodEntryPage – page wrapper around the FoodEntryForm component.
 *
 * Props:
 *   onAddFoodItem(newItem) – forwarded straight to FoodEntryForm
 *
 * Demonstrates:
 *   - useEffect (set document title on mount)
 *   - Composing pages from smaller components
 *   - Passing callback props down through layers
 */
function FoodEntryPage({ onAddFoodItem }) {
  // useEffect: update the browser tab title when this page is active
  useEffect(() => {
    document.title = 'FoodHub – Add Food Item';

    return () => {
      document.title = 'FoodHub – Online Food Ordering';
    };
  }, []); // empty dependency array = run once on mount, cleanup on unmount

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">➕ Add a New Food Item</h1>
        <p className="page-subtitle">
          Fill in the details below to add a dish to the menu.
        </p>
      </div>

      {/* Form component receives the callback via props */}
      <div className="form-wrapper">
        <FoodEntryForm onAddFoodItem={onAddFoodItem} />
      </div>
    </div>
  );
}

export default FoodEntryPage;
