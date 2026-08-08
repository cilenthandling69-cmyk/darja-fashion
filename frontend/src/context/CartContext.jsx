import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function initialCart() {
  try {
    return JSON.parse(localStorage.getItem("darja_cart")) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("darja_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, options = {}) => {
    const size = options.size || product.sizes?.[0] || "M";
    const color = options.color || product.colors?.[0] || "Black";
    const key = `${product._id}-${size}-${color}`;

    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 99) }
            : item
        );
      }
      return [...current, { key, product, size, color, quantity: 1 }];
    });
  };

  const removeItem = (key) => setItems((current) => current.filter((item) => item.key !== key));

  const updateQuantity = (key, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.product.stock || 99)) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }),
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
