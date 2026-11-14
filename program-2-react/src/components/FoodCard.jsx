/**
 * FoodCard – displays a single food item.
 *
 * Props:
 *   food  – { id, name, description, category, price }
 *
 * This is a "presentational" component – it only receives data via props
 * and renders it. It has no internal state.
 */
function FoodCard({ food }) {
  // Map category names to emojis for a nicer look
  const categoryEmoji = {
    Pizza: '🍕',
    Burgers: '🍔',
    Starters: '🥗',
    Drinks: '🥤',
    Desserts: '🍰',
    Pasta: '🍝',
    Sushi: '🍣',
    Other: '🍴',
  };

  const emoji = categoryEmoji[food.category] || '🍴';

  return (
    <div className="food-card">
      {/* Category badge in top-right corner */}
      <span className="food-card-badge">{emoji} {food.category}</span>

      <h3 className="food-card-name">{food.name}</h3>
      <p className="food-card-description">{food.description}</p>

      <div className="food-card-footer">
        <span className="food-card-price">₹{parseFloat(food.price).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

export default FoodCard;
