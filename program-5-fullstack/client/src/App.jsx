import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FoodListingPage from './pages/FoodListingPage';
import FoodEntryPage from './pages/FoodEntryPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './AuthContext';

// Only logged-in users can open these pages
function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FoodListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add" element={<Protected><FoodEntryPage /></Protected>} />
          <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>© 2026 FoodHub – Online Food Ordering System (Full Stack)</p>
      </footer>
    </div>
  );
}
