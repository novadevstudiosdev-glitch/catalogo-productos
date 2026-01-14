'use client';

import { useState, useCallback } from 'react';

export interface OrderItem {
  _id?: string;
  id?: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCountry: string;
  clientProvince: string;
  additionalMessage?: string;
  items: OrderItem[];
  totalAmount: number;
}

interface OrdersState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useOrders() {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: false,
    error: null,
  });

  const createOrder = useCallback(async (orderData: CreateOrderInput) => {
    setState({ orders: [], loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear orden');
      }

      const result = await response.json();
      setState({ orders: [result.data], loading: false, error: null });
      return result.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setState({ orders: [], loading: false, error: errorMsg });
      throw error;
    }
  }, []);

  const getOrders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${API_URL}/orders`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Error al obtener órdenes');
      }

      const result = await response.json();
      setState({ orders: result.data || [], loading: false, error: null });
      return result.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw error;
    }
  }, []);

  const getOrderByNumber = useCallback(async (orderNumber: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${API_URL}/orders/number/${orderNumber}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw error;
    }
  }, []);

  const searchByEmail = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${API_URL}/orders/search/email?email=${encodeURIComponent(email)}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Error al buscar órdenes');
      }

      const result = await response.json();
      setState({ orders: result.data || [], loading: false, error: null });
      return result.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar orden');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(errorMsg);
    }
  }, []);

  return {
    ...state,
    createOrder,
    getOrders,
    getOrderByNumber,
    searchByEmail,
    updateOrderStatus,
  };
}
