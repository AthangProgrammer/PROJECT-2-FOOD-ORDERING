import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function CartPage() {
  const { token } = useAuth();
  const { cart, total, setQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null); // the order returned by the API

  const placeOrder = async () => {
    if (!token) return navigate('/login');
    setPlacing(true);
    setError('');
    try {
      const order = await api('/orders', {
        method: 'POST',
        token,
        body: { items: cart.map((i) => ({ foodId: i.food._id, quantity: i.quantity })) },
      });
      setConfirmation(order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  // Order confirmation screen
  if (confirmation) {
    return (
      <div className="page">
        <div className="form-wrapper">
          <div className="food-form confirmation">
            <h1 className="page-title">✅ Order Confirmed!</h1>
            <p>Thank you! Your order <strong>#{confirmation._id.slice(-6).toUpperCase()}</strong> has been placed.</p>
            <ul className="order-items">
              {confirmation.items.map((i) => (
                <li key={i.food}><span>{i.name} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></li>
              ))}
            </ul>
            <p className="order-total">Total: {money(confirmation.total)}</p>
            <p>Status: <strong>{confirmation.status}</strong></p>
            <div className="form-actions">
              <Link to="/orders" className="btn btn-primary">View My Orders</Link>
              <Link to="/" className="btn btn-secondary">Back to Menu</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Your Cart</h1>
      </header>

      {cart.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p><Link to="/">Browse the menu</Link> and add something tasty.</p>
        </div>
      ) : (
        <div className="form-wrapper">
          <div className="food-form">
            <Alert type="error" message={error} />
            {cart.map(({ food, quantity }) => (
              <div className="cart-row" key={food._id}>
                <div className="cart-info">
                  <strong>{food.name}</strong>
                  <span className="muted">{money(food.price)} each</span>
                </div>
                <div className="qty">
                  <button type="button" className="qty-btn" aria-label={`Decrease ${food.name}`} onClick={() => setQuantity(food._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button type="button" className="qty-btn" aria-label={`Increase ${food.name}`} onClick={() => setQuantity(food._id, Math.min(20, quantity + 1))}>+</button>
                </div>
                <span className="cart-line-total">{money(food.price * quantity)}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFromCart(food._id)}>Remove</button>
              </div>
            ))}
            <p className="order-total">Total: {money(total)}</p>
            {!token && <p className="muted">You need to log in to place an order.</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing order...' : token ? 'Place Order' : 'Log in to order'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
