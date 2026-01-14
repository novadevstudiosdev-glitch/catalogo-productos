'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Search, Eye, Loader2, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  _id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCountry: string;
  clientProvince: string;
  additionalMessage?: string;
  items: Array<{
    productName: string;
    productPrice: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUSES = ['pendiente', 'procesando', 'en-envío', 'enviado', 'entregado', 'cancelado'];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'procesando':
      return 'bg-blue-100 text-blue-800';
    case 'en-envío':
      return 'bg-purple-100 text-purple-800';
    case 'enviado':
      return 'bg-indigo-100 text-indigo-800';
    case 'entregado':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function AdminOrdersPage() {
  const { getOrderByNumber, searchByEmail, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const [searchType, setSearchType] = useState<'email' | 'number'>('number');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un valor para buscar',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let results: Order[] = [];
      if (searchType === 'number') {
        const order = await getOrderByNumber(searchValue.trim());
        results = order ? [order] : [];
      } else {
        results = await searchByEmail(searchValue.trim());
      }

      if (results.length === 0) {
        toast({
          title: 'Sin resultados',
          description: `No se encontraron órdenes con ese ${searchType === 'number' ? 'número' : 'email'}`,
        });
      }
      setOrders(results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al buscar la orden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un estado',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(selectedOrder._id, newStatus, statusNotes);
      toast({
        title: 'Éxito',
        description: 'Estado actualizado correctamente',
      });
      setIsStatusChangeOpen(false);
      setNewStatus('');
      setStatusNotes('');

      // Actualizar orden en la lista
      setOrders(orders.map((o) => (o._id === selectedOrder._id ? { ...o, status: newStatus, notes: statusNotes } : o)));
      setSelectedOrder({ ...selectedOrder, status: newStatus, notes: statusNotes });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar estado',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver a Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Búsqueda de Órdenes</h1>
          <p className="mt-2 text-muted-foreground">Busca y gestiona órdenes de compra</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar por:</label>
              <Select value={searchType} onValueChange={(value) => setSearchType(value as 'email' | 'number')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Número de Orden</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex gap-2 items-end">
              <Input placeholder={searchType === 'number' ? 'ORD-00001' : 'tu@email.com'} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="flex-1" />
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Realiza una búsqueda para ver las órdenes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-lg border border-border bg-card p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailOpen(true);
                        setNewStatus(order.status);
                        setStatusNotes('');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalles
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 text-sm mb-4">
                  <p>
                    <span className="font-medium">Cliente:</span> {order.clientName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {order.clientEmail}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {order.clientPhone}
                  </p>
                  <p>
                    <span className="font-medium">Artículos:</span> {order.items.length} producto(s)
                  </p>
                  <p>
                    <span className="font-medium">Total:</span> {formatPrice(order.totalAmount)}
                  </p>
                </div>

                {order.notes && (
                  <div className="rounded bg-secondary/50 p-3 text-sm">
                    <p className="font-medium mb-1">Notas:</p>
                    <p className="text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Información completa de la orden</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Cliente */}
              <div>
                <h3 className="font-bold mb-3">Cliente</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Nombre:</span> {selectedOrder.clientName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedOrder.clientEmail}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {selectedOrder.clientPhone}
                  </p>
                  <p>
                    <span className="font-medium">Dirección:</span> {selectedOrder.clientAddress}
                  </p>
                  <p>
                    <span className="font-medium">País/Provincia:</span> {selectedOrder.clientCountry}/{selectedOrder.clientProvince}
                  </p>
                  {selectedOrder.additionalMessage && (
                    <p>
                      <span className="font-medium">Mensaje:</span> {selectedOrder.additionalMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Artículos */}
              <div>
                <h3 className="font-bold mb-3">Artículos</h3>
                <div className="space-y-2 text-sm">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.productPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Estado */}
              <div className="rounded-lg bg-secondary/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">Estado Actual</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <Button onClick={() => setIsStatusChangeOpen(true)} size="sm" className="gap-2">
                    <Check className="h-4 w-4" />
                    Cambiar
                  </Button>
                </div>
              </div>

              <Button onClick={() => setIsDetailOpen(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusChangeOpen} onOpenChange={setIsStatusChangeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Estado</DialogTitle>
            <DialogDescription>{selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nuevo Estado</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
              <textarea value={statusNotes} onChange={(e) => setStatusNotes(e.target.value)} placeholder="Ej: En preparación..." maxLength={200} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none" rows={3} />
              <p className="text-xs text-muted-foreground mt-1">{statusNotes.length}/200</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsStatusChangeOpen(false)} disabled={isUpdatingStatus} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleStatusChange} disabled={isUpdatingStatus} className="flex-1 gap-2">
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
