import { NavLink } from 'react-router-dom';

/**
 * Navbar – top navigation bar.
 *
 * Uses NavLink from React Router so the active route is highlighted.
 * Props: none (all navigation state comes from React Router).
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Simple emoji logo – no images needed */}
        <span className="navbar-logo">🍽️</span>
        <span className="navbar-title">FoodHub</span>
      </div>

      <ul className="navbar-links">
        <li>
          {/* NavLink automatically adds the "active" class to the current route */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            🏠 Food Listing
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            ➕ Add Food Item
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
