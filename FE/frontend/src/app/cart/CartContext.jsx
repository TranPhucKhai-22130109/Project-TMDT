"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCartCount } from "@/services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [guestCart, setGuestCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load guest cart từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("blitz-cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setGuestCart(parsedCart);

      const count = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    }
  }, []);

  // Lưu guest cart vào localStorage
  useEffect(() => {
    localStorage.setItem("blitz-cart", JSON.stringify(guestCart));
  }, [guestCart]);

  // Dùng cho user đã login: load count thật từ DB
  const reloadCartCount = async () => {
    try {
      const data = await getCartCount();
      setCartCount(data.count || 0);
    } catch (error) {
      console.error("Reload cart count error:", error);
    }
  };

  const removeGuestCart = (id) => {
    setGuestCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);
      const count = newCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      return newCart;
    });
  };

  const updateGuestQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setGuestCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      );

      const count = newCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);

      return newCart;
    });
  };

  const clearGuestCart = () => {
    setGuestCart([]);
    setCartCount(0);
    localStorage.removeItem("blitz-cart");
  };

  const guestCartTotal = guestCart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );

  const addGuestCart = (product, quantity = 1) => {
    setGuestCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      let newCart;

      if (existing) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }

      localStorage.setItem("blitz-cart", JSON.stringify(newCart));
      setCartCount(newCart.length);

      return newCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart: guestCart,
        guestCart,
        cartCount,
        cartTotal: guestCartTotal,

        addToCart: addGuestCart,
        addGuestCart,
        removeFromCart: removeGuestCart,
        updateQuantity: updateGuestQuantity,
        clearCart: clearGuestCart,
        clearGuestCart,

        reloadCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
