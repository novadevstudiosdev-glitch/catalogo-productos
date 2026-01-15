'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/api';
import type { Order } from '@/lib/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  new: 'Nuevo',
  paid: 'Pagado',
  in_production: 'En producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filtered = orders.filter((o) => {
    const matchesStatus = status === 'all' || o.status === status;
    const matchesSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Órdenes</h1>
      <div className="flex gap-4 mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1">
          <option value="all">Todas</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Buscar por ID o cliente" value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded px-2 py-1 flex-1" />
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left">Zona</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/50 cursor-pointer" onClick={() => (window.location.href = `/admin/orders/${order.id}`)}>
                  <td className="p-2 font-mono">{order.id}</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString('es-AR')}</td>
                  <td className="p-2">{order.customer.name}</td>
                  <td className="p-2">{order.shipping.zone}</td>
                  <td className="p-2">${order.total.toLocaleString('es-AR')}</td>
                  <td className="p-2">
                    <span className="badge bg-muted-foreground">{STATUS_LABELS[order.status]}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
