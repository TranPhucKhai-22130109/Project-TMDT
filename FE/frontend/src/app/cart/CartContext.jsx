'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // Load giỏ hàng từ localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('blitz-cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    // Lưu giỏ hàng vào localStorage
    useEffect(() => {
        localStorage.setItem('blitz-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    // ── Thêm mới cho chức năng Đặt hàng ──
    const clearCart = () => setCart([]);

    // Các field cũ (giữ nguyên tên để không break code khác)
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Alias dùng trong checkout page mới
    const totalItems = cartCount;
    const totalAmount = cartTotal;

    // items dạng chuẩn cho checkout (map id → productId)
    const checkoutItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || item.image || '',
        quantity: item.quantity,
    }));

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            totalItems,
            totalAmount,
            checkoutItems,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);