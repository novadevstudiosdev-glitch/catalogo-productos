'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Search, Loader2, Eye, Download } from 'lucide-react';
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
    case 'confirmado':
      return 'bg-blue-100 text-blue-800';
    case 'enviado':
      return 'bg-purple-100 text-purple-800';
    case 'entregado':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function OrdersPage() {
  const { getOrders, searchByEmail, loading, orders } = useOrders();
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadAllOrders();
  }, []);

  const loadAllOrders = async () => {
    try {
      const data = await getOrders();
      setAllOrders(data);
      setHasSearched(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar órdenes',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      loadAllOrders();
      return;
    }

    try {
      const data = await searchByEmail(searchEmail);
      setAllOrders(data);
      setHasSearched(true);
      if (data.length === 0) {
        toast({
          title: 'Sin resultados',
          description: 'No se encontraron órdenes para este email',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al buscar órdenes',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = (order: Order) => {
    const content = `
ORDEN DE COMPRA - ${order.orderNumber}
=====================================

DATOS DEL CLIENTE:
Nombre: ${order.clientName}
Email: ${order.clientEmail}
Teléfono: ${order.clientPhone}
Dirección: ${order.clientAddress}
País: ${order.clientCountry}
Provincia: ${order.clientProvince}

ITEMS DEL PEDIDO:
${order.items.map((item) => `- ${item.productName} x${item.quantity} = ${formatPrice(item.productPrice * item.quantity)}`).join('\n')}

TOTAL: ${formatPrice(order.totalAmount)}

ESTADO: ${order.status}
FECHA: ${formatDate(order.createdAt)}

${order.additionalMessage ? `MENSAJE: ${order.additionalMessage}` : ''}
${order.notes ? `NOTAS: ${order.notes}` : ''}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${order.orderNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
          <p className="mt-2 text-muted-foreground">Busca y visualiza tus órdenes de compra</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 rounded-lg border border-border bg-card p-6">
          <label className="block text-sm font-medium mb-3">Buscar por Email</label>
          <div className="flex gap-2">
            <Input type="email" placeholder="tu@email.com" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="flex-1" />
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </form>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : allOrders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">{hasSearched ? 'No se encontraron órdenes para este email' : 'No hay órdenes disponibles'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left font-semibold">Número</th>
                  <th className="p-3 text-left font-semibold">Cliente</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Items</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-center font-semibold">Estado</th>
                  <th className="p-3 text-left font-semibold">Fecha</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order._id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 font-mono font-bold">{order.orderNumber}</td>
                    <td className="p-3">{order.clientName}</td>
                    <td className="p-3 text-muted-foreground">{order.clientEmail}</td>
                    <td className="p-3 text-sm">{order.items.length} artículo(s)</td>
                    <td className="p-3 text-right font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="p-3 text-center">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadPDF(order)} title="Descargar">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de la Orden - {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>Información completa de la orden de compra</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Datos del Cliente */}
                <div>
                  <h3 className="font-bold mb-3">Datos del Cliente</h3>
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
                      <span className="font-medium">País:</span> {selectedOrder.clientCountry}
                    </p>
                    <p>
                      <span className="font-medium">Provincia:</span> {selectedOrder.clientProvince}
                    </p>
                    {selectedOrder.additionalMessage && (
                      <p>
                        <span className="font-medium">Mensaje:</span> {selectedOrder.additionalMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold mb-3">Artículos del Pedido</h3>
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

                {/* Status and Total */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estado:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Creado: {formatDate(selectedOrder.createdAt)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => handleDownloadPDF(selectedOrder)} className="flex-1" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button onClick={() => setIsDetailOpen(false)} className="flex-1">
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
