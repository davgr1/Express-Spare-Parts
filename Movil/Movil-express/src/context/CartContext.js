import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((i) => i._id === item._id);
    const currentQuantity = existingItem ? (existingItem.quantity || 1) : 0;
    
    if (item.stock !== undefined && currentQuantity + 1 > item.stock) {
      Alert.alert('Stock insuficiente', `Solo hay ${item.stock} unidades disponibles de este producto.`);
      return false;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i._id === item._id);
      if (existingIndex >= 0) {
        // Si ya existe, incrementar cantidad
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      }
      // Si no existe, agregar con cantidad 1
      return [...prev, { ...item, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    const existingItem = cartItems.find((i) => i._id === itemId);
    if (existingItem && existingItem.stock !== undefined && newQuantity > existingItem.stock) {
      Alert.alert('Stock insuficiente', `Solo hay ${existingItem.stock} unidades disponibles.`);
      return false;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return true;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i._id === itemId ? { ...i, quantity: newQuantity } : i
      )
    );
    return true;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
