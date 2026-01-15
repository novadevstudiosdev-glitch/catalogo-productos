// Order detail page for admin
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, updateOrderStatus } from '@/lib/api';
import type { Order } from '@/lib/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  new: 'Nuevo',
  paid: 'Pagado',
  in_production: 'En producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<Order['status']>('new');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params?.id) {
      getOrderById(params.id as string).then((o) => {
        setOrder(o || null);
        setStatus(o?.status || 'new');
        setLoading(false);
      });
    }
  }, [params?.id]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return;
    setSaving(true);
    await updateOrderStatus(order.id, newStatus);
    setStatus(newStatus);
    setOrder({ ...order, status: newStatus });
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Orden no encontrada</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button className="mb-4 text-sm text-muted-foreground" onClick={() => router.back()}>
        &larr; Volver
      </button>
      <h1 className="text-2xl font-bold mb-2">Orden {order.id}</h1>
      <div className="mb-4 flex gap-4 items-center">
        <span className="badge bg-muted-foreground">{STATUS_LABELS[status]}</span>
        <select value={status} onChange={(e) => handleStatusChange(e.target.value as Order['status'])} disabled={saving} className="border rounded px-2 py-1">
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={() => handleStatusChange('shipped')} disabled={status === 'shipped' || saving}>
          Marcar enviado
        </button>
        <button className="btn btn-primary" onClick={() => handleStatusChange('delivered')} disabled={status === 'delivered' || saving}>
          Marcar entregado
        </button>
      </div>
      <div className="bg-card rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">Cliente</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Nombre:</span> {order.customer.name}
          </div>
          <div>
            <span className="font-medium">Tel:</span> {order.customer.phone}
          </div>
          <div>
            <span className="font-medium">Email:</span> {order.customer.email}
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">Envío</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Zona:</span> {order.shipping.zone}
          </div>
          <div>
            <span className="font-medium">Dirección:</span> {order.shipping.address}
          </div>
          <div>
            <span className="font-medium">Ciudad:</span> {order.shipping.city}
          </div>
          <div>
            <span className="font-medium">Provincia:</span> {order.shipping.province}
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">Pago</h2>
        <div className="text-sm">
          <span className="font-medium">Método:</span> {order.paymentMethod}
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">Items</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Talle</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Precio</th>
              <th className="p-2 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="p-2">
                  {item.name}
                  {item.options?.customName && ` (${item.options.customName})`}
                  {item.options?.customNumber && ` #${item.options.customNumber}`}
                </td>
                <td className="p-2">{item.size || '-'}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">${item.price.toLocaleString('es-AR')}</td>
                <td className="p-2">${(item.price * item.qty).toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-card rounded-lg p-4 mb-4 flex flex-col gap-2">
        <div>
          <span className="font-medium">Subtotal:</span> ${order.subtotal.toLocaleString('es-AR')}
        </div>
        <div>
          <span className="font-medium">Envío:</span> ${order.shippingCost.toLocaleString('es-AR')}
        </div>
        <div className="text-lg font-bold">
          <span>Total:</span> ${order.total.toLocaleString('es-AR')}
        </div>
      </div>
      {order.notes && <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-sm">{order.notes}</div>}
      <button className="btn btn-outline w-full mt-4" onClick={() => window.print()}>
        Imprimir remito
      </button>
    </div>
  );
}
