'use client';

import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Check, Copy, Printer } from 'lucide-react';
import type { Order } from '@/lib/types';
import { updateOrderStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface OrdersTabProps {
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', // Nuevas
  paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100', // Pagadas
  in_production: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', // En producción
  shipped: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100', // Enviadas
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', // Entregadas
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', // Canceladas
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Nueva',
  paid: 'Pagada',
  in_production: 'En producción',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
};

export function OrdersTab({ orders: initialOrders }: OrdersTabProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'7' | '30' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');
  const { toast } = useToast();

  // Filter and search
  // All data comes from backend now
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(term) || o.customer.name.toLowerCase().includes(term) || o.customer.email.toLowerCase().includes(term) || o.customer.phone.includes(term));
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Date range filter
    const now = new Date();
    if (filterDateRange !== 'all') {
      const days = filterDateRange === '7' ? 7 : 30;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter((o) => new Date(o.createdAt) >= startDate);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.total - a.total;
      }
    });

    return result;
  }, [orders, searchTerm, filterStatus, filterDateRange, sortBy]);

  const handleSaveStatus = async () => {
    if (!selectedOrder || !editStatus || selectedOrder.status === editStatus) return;
    setSavingStatus(true);
    try {
      await updateOrderStatus(selectedOrder.id, editStatus as Order['status']);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: editStatus as Order['status'] } : o)));
      setSelectedOrder({ ...selectedOrder, status: editStatus as Order['status'] });
      toast({
        title: 'Éxito',
        description: `Orden actualizada a ${editStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar la orden. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
    setSavingStatus(false);
  };

  const handleBulkShip = async () => {
    const newOrders = filteredOrders.filter((o) => o.status !== 'shipped' && o.status !== 'delivered');
    for (const order of newOrders) {
      await updateOrderStatus(order.id, 'shipped');
    }
    setOrders((prev) => prev.map((o) => (newOrders.some((no) => no.id === o.id) ? { ...o, status: 'shipped' } : o)));
    toast({
      title: 'Éxito',
      description: `${newOrders.length} órdenes marcadas como enviadas`,
    });
  };

  const copyOrderSummary = (order: Order) => {
    const summary = `
*ORDEN #${order.id}*
👤 ${order.customer.name}
📞 ${order.customer.phone}
📧 ${order.customer.email}

📍 ${order.shipping.address}
${order.shipping.city}, ${order.shipping.province}
Zona: ${order.shipping.zone}

🛒 Items:
${order.items.map((item) => `• ${item.name} (x${item.qty}) - $${(item.price * item.qty).toLocaleString('es-AR')}`).join('\n')}

💰 Subtotal: $${order.subtotal.toLocaleString('es-AR')}
📦 Envío: $${order.shippingCost.toLocaleString('es-AR')}
*Total: $${order.total.toLocaleString('es-AR')}*

💳 ${order.paymentMethod}
📋 Estado: ${order.status}
    `.trim();

    navigator.clipboard.writeText(summary);
    toast({
      title: 'Copiado',
      description: 'Resumen de orden copiado al portapapeles',
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-8">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input placeholder="Buscar: ID, cliente, email, teléfono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-xs sm:text-sm rounded-lg" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="new">Nuevas</SelectItem>
            <SelectItem value="paid">Pagadas</SelectItem>
            <SelectItem value="in_production">En producción</SelectItem>
            <SelectItem value="shipped">Enviadas</SelectItem>
            <SelectItem value="delivered">Entregadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDateRange} onValueChange={(v) => setFilterDateRange(v as any)}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="all">Todas las órdenes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="highest">Mayor total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <Button onClick={handleBulkShip} variant="outline" size="sm" className="rounded-lg">
          <Check className="h-4 w-4 mr-2" />
          Marcar como enviadas ({filteredOrders.filter((o) => o.status !== 'shipped' && o.status !== 'delivered').length})
        </Button>
      </div>

      {/* Orders Table */}
      <Card className="rounded-2xl shadow-sm border border-border">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground rounded-l-xl">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground rounded-r-xl">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground bg-background rounded-xl">
                    No hay órdenes
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/40'} hover:bg-accent/60 rounded-xl`}>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap align-middle rounded-l-xl">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 whitespace-nowrap align-middle">{order.customer.name}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap align-middle">${order.total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3 align-middle">
                      <Badge className={STATUS_COLORS[order.status] + ' rounded-full px-2 py-1 text-xs border-none font-medium'}>{STATUS_LABELS[order.status] ?? order.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap align-middle">{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3 align-middle rounded-r-xl">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)} className="text-xs rounded-full px-3 py-1" aria-label="Ver detalle">
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Detail Sheet */}
      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
            setEditStatus(null);
          } else if (selectedOrder) {
            setEditStatus(selectedOrder.status);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Orden #{selectedOrder.id.slice(0, 12)}</SheetTitle>
                <SheetDescription>
                  {new Date(selectedOrder.createdAt).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                <div className="space-y-6">
                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Estado</label>
                    <Select value={editStatus ?? selectedOrder.status} onValueChange={setEditStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="procesando">Procesando</SelectItem>
                        <SelectItem value="en-envío">En envío</SelectItem>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="entregado">Entregado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSaveStatus} disabled={savingStatus || !editStatus || editStatus === selectedOrder.status} className="mt-2 w-full" variant="default" size="sm">
                      {savingStatus ? 'Guardando...' : 'Guardar estado'}
                    </Button>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Cliente</h3>
                    <div className="space-y-1 text-sm">
                      <p>{selectedOrder.customer.name}</p>
                      <p className="text-muted-foreground">{selectedOrder.customer.email}</p>
                      <p className="text-muted-foreground">{selectedOrder.customer.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Envío</h3>
                    <div className="space-y-1 text-sm">
                      <p>{selectedOrder.shipping.address}</p>
                      <p className="text-muted-foreground">
                        {selectedOrder.shipping.city}, {selectedOrder.shipping.province}
                      </p>
                      <p className="text-muted-foreground">Zona: {selectedOrder.shipping.zone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Items</h3>
                    <div className="space-y-2 text-sm">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.size && <p className="text-xs text-muted-foreground">Talla: {item.size}</p>}
                            {item.options?.customName && <p className="text-xs text-muted-foreground">Nombre: {item.options.customName}</p>}
                            {item.options?.customNumber && <p className="text-xs text-muted-foreground">Número: {item.options.customNumber}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(item.price * item.qty).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-muted-foreground">x{item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>${selectedOrder.shippingCost.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment & Notes */}
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Método de pago:</span> {selectedOrder.paymentMethod}
                    </p>
                    {selectedOrder.notes && (
                      <p>
                        <span className="font-semibold">Notas:</span> {selectedOrder.notes}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button onClick={() => copyOrderSummary(selectedOrder)} variant="outline" className="w-full gap-2 text-xs sm:text-sm">
                      <Copy className="h-4 w-4" />
                      Copiar para WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm">
                      <Printer className="h-4 w-4" />
                      Imprimir remito
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
