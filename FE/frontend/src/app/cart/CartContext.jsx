"use client";

import { createContext, useContext, useState } from "react";
import { getCartCount } from "@/services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const reloadCartCount = async () => {
    try {
      const data = await getCartCount();
      setCartCount(data.count || 0);
    } catch (error) {
      console.error("Load cart count error:", error);
      setCartCount(0);
    }
  };

  const clearCartCount = () => {
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        reloadCartCount,
        clearCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);