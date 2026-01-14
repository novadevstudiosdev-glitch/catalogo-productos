'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CartItemCustomization {
  size: string;
  color: string;
  personalized: boolean;
  name?: string;
  number?: string;
  notes?: string;
}

export interface CartItem {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization: CartItemCustomization;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string, customization: CartItemCustomization) => void;
  updateQuantity: (id: number | string, customization: CartItemCustomization, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getItemKey(id: number | string, customization: CartItemCustomization): string {
  return `${id}-${customization.size}-${customization.color}-${customization.personalized}-${customization.name || ''}-${customization.number || ''}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => getItemKey(item.id, item.customization) === getItemKey(newItem.id, newItem.customization));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }

      return [...prevItems, newItem];
    });
  }, []);

  const removeItem = useCallback((id: number, customization: CartItemCustomization) => {
    setItems((prevItems) => prevItems.filter((item) => getItemKey(item.id, item.customization) !== getItemKey(id, customization)));
  }, []);

  const updateQuantity = useCallback((id: number, customization: CartItemCustomization, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) => prevItems.map((item) => (getItemKey(item.id, item.customization) === getItemKey(id, customization) ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
