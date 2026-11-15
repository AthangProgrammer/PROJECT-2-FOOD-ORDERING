import { useState, useEffect } from 'react';
import FoodList from '../components/FoodList';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

export default function FoodListingPage() {
  const { token, user } = useAuth();
  const { addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null); // { type, text }

  // Load the menu from the API when the page opens
  useEffect(() => {
    api('/foods')
      .then(setFoods)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (food) => {
    addToCart(food);
    setMessage({ type: 'success', text: `${food.name} added to cart.` });
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await api(`/foods/${foodId}`, { method: 'DELETE', token });
      setFoods((list) => list.filter((f) => f._id !== foodId));
      setMessage({ type: 'success', text: 'Food item deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Our Menu</h1>
        <p className="page-subtitle">Food items are loaded live from MongoDB through the Express API.</p>
      </header>

      <Alert type={message?.type} message={message?.text} />
      {loading && <p className="empty-state">Loading menu...</p>}
      <Alert type="error" message={error} />
      {!loading && !error && <FoodList foods={foods} userId={user?.id} onAdd={handleAdd} onDelete={handleDelete} />}
    </div>
  );
}
