import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🍽️</span>
        <span className="navbar-title">FoodHub</span>
      </div>

      <ul className="navbar-links">
        <li><NavLink to="/" end className={linkClass}>Menu</NavLink></li>
        <li><NavLink to="/cart" className={linkClass}>🛒 Cart ({count})</NavLink></li>
        {user ? (
          <>
            <li><NavLink to="/add" className={linkClass}>➕ Add Food</NavLink></li>
            <li><NavLink to="/orders" className={linkClass}>My Orders</NavLink></li>
            <li><span className="nav-user">Hi, {user.name}</span></li>
            <li><button type="button" className="nav-logout" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
            <li><NavLink to="/register" className={linkClass}>Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}
