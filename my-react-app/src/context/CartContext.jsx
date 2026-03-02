import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [cartId, setCartId] = useState(null);

    useEffect(() => {
        if (user) {
            loadCart(user.id);
        } else {
            setCart([]);
            setCartId(null);
        }
    }, [user]);

    const loadCart = async (userId) => {
        let userCart = await api.getCart(userId);
        if (!userCart) {
            userCart = await api.createCart(userId);
        }
        setCartId(userCart.id);
        setCart(userCart.items || []);
    };

    const addToCart = async (product, quantity = 1) => {
        if (!user) return false; // Should redirect in component

        const existingItem = cart.find(item => item.productId === product.id);
        let newItems;

        if (existingItem) {
            newItems = cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newItems = [...cart, { productId: product.id, quantity, product }]; // storing product details for simplicity in UI, ideally just ID and fetch details
        }

        setCart(newItems);
        await api.updateCart(cartId, newItems);
        return true;
    };

    const removeFromCart = async (productId) => {
        const newItems = cart.filter(item => item.productId !== productId);
        setCart(newItems);
        await api.updateCart(cartId, newItems);
    };

    const updateQuantity = async (productId, delta) => {
        const newItems = cart.map(item => {
            if (item.productId === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        });
        setCart(newItems);
        await api.updateCart(cartId, newItems);
    };

    const clearCart = async () => {
        setCart([]);
        if (cartId) {
            await api.updateCart(cartId, []);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
