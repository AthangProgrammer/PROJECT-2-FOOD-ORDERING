import { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders', { token })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">My Orders</h1>
      </header>

      {loading && <p className="empty-state">Loading orders...</p>}
      <Alert type="error" message={error} />
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">🧾</span>
          <h2>No orders yet</h2>
          <p>Add items to your cart and place your first order.</p>
        </div>
      )}

      <div className="orders-list">
        {orders.map((o) => (
          <div className="food-card" key={o._id}>
            <div className="order-head">
              <strong>Order #{o._id.slice(-6).toUpperCase()}</strong>
              <span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
            <ul className="order-items">
              {o.items.map((i) => (
                <li key={i.food}><span>{i.name} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></li>
              ))}
            </ul>
            <p className="order-total">Total: {money(o.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
