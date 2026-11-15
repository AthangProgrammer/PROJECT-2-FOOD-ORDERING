const EMOJI = { Pizza: '🍕', Burgers: '🍔', Starters: '🥗', Drinks: '🥤', Desserts: '🍰', Pasta: '🍝', Sushi: '🍣', Other: '🍴' };

// Props: food, canDelete, onAdd(food), onDelete(foodId)
export default function FoodCard({ food, canDelete, onAdd, onDelete }) {
  return (
    <div className="food-card">
      <span className="food-card-badge">{EMOJI[food.category] || '🍴'} {food.category}</span>
      <h3 className="food-card-name">{food.name}</h3>
      <p className="food-card-description">{food.description}</p>

      <div className="food-card-footer">
        <span className="food-card-price">₹{Number(food.price).toLocaleString('en-IN')}</span>
        <div className="card-actions">
          {canDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(food._id)}>Delete</button>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onAdd(food)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
