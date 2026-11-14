import FoodCard from './FoodCard.jsx';

/**
 * FoodList – renders a grid of FoodCard components.
 *
 * Props:
 *   foodItems – array of food objects
 *   searchTerm – string used to filter items (passed from parent)
 *
 * Demonstrates:
 *   - Conditional rendering  (empty-state message when list is empty)
 *   - Rendering lists with .map() and unique key prop
 *   - Receiving and using props
 */
function FoodList({ foodItems, searchTerm }) {
  // Filter items based on the search term (case-insensitive)
  const filtered = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----- conditional rendering -----
  if (foodItems.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🍽️</span>
        <h2>No food items yet!</h2>
        <p>Go to <strong>Add Food Item</strong> to add your first dish.</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <h2>No results found</h2>
        <p>Try a different name or category.</p>
      </div>
    );
  }

  return (
    <div className="food-grid">
      {filtered.map((food) => (
        // Each child in a list must have a unique "key" prop
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}

export default FoodList;
