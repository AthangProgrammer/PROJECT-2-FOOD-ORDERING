import { useState } from 'react';
import FoodCard from './FoodCard';

export const CATEGORIES = ['Pizza', 'Burgers', 'Starters', 'Drinks', 'Desserts', 'Pasta', 'Sushi', 'Other'];

// Search box + category filter + grid of food cards
export default function FoodList({ foods, userId, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = foods.filter((f) => {
    const text = searchTerm.toLowerCase();
    const matchesSearch = f.name.toLowerCase().includes(text) || f.description.toLowerCase().includes(text);
    return matchesSearch && (category === 'All' || f.category === category);
  });

  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-input filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {foods.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🍽️</span>
          <h2>No food items yet!</h2>
          <p>Log in and use <strong>Add Food</strong> to add the first dish.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h2>No results found</h2>
          <p>Try a different name or category.</p>
        </div>
      ) : (
        <div className="food-grid">
          {filtered.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              canDelete={Boolean(userId) && food.createdBy === userId}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
