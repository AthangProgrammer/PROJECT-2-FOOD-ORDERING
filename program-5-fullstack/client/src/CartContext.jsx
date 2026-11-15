import { createContext, useContext, useState } from 'react';

// The shopping cart lives in React state (it resets when the page is refreshed).
// cart = [{ food, quantity }]
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (food) =>
    setCart((items) => {
      const existing = items.find((i) => i.food._id === food._id);
      if (existing) return items.map((i) => (i.food._id === food._id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...items, { food, quantity: 1 }];
    });

  // Changing quantity to 0 removes the item
  const setQuantity = (foodId, quantity) =>
    setCart((items) =>
      items.map((i) => (i.food._id === foodId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0)
    );

  const removeFromCart = (foodId) => setCart((items) => items.filter((i) => i.food._id !== foodId));
  const clearCart = () => setCart([]);

  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.reduce((sum, i) => sum + i.quantity * i.food.price, 0);

  return (
    <CartContext.Provider value={{ cart, count, total, addToCart, setQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
