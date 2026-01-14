'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface CartItemCustomization {
  size?: string;
  color?: string;
  personalized?: boolean;
  name?: string;
  number?: string;
  notes?: string;
}

export interface CartItem {
  _id?: string;
  id: number | string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  customization?: CartItemCustomization;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mok-store-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar carrito del localStorage (solo cliente)
  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setItems(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setItems([]);
      }
    }
    setIsHydrated(true);
  }, []);

  // Guardar carrito en localStorage cada que cambia
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const quantity = newItem.quantity || 1;
      const existingIndex = prevItems.findIndex((item) => item._id === newItem._id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Validar que no supere el stock
        if (newQty <= updated[existingIndex].stock) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        }
        return prevItems;
      }

      // Validar que la cantidad inicial no supere el stock
      if (quantity <= newItem.stock) {
        return [...prevItems, { ...newItem, quantity }];
      }
      return prevItems;
    });
  }, []);

  const removeItem = useCallback((id: number | string) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: number | string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item._id === id) {
            // Validar que no supere el stock
            if (quantity <= item.stock) {
              return { ...item, quantity };
            }
            return item;
          }
          return item;
        })
      );
    },
    [removeItem]
  );

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
