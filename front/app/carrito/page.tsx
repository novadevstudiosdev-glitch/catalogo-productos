'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCountry: string;
  clientProvince: string;
  additionalMessage: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { toast } = useToast();
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCountry: 'Argentina',
    clientProvince: '',
    additionalMessage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre: no vacío, sin números
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre es requerido';
    } else if (/\d/.test(formData.clientName)) {
      newErrors.clientName = 'El nombre no puede contener números';
    } else if (formData.clientName.trim().length < 3) {
      newErrors.clientName = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Email inválido';
    }

    // Validar teléfono: solo números, espacios, guiones, paréntesis y +
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'El teléfono es requerido';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'El teléfono solo puede contener números y caracteres válidos (+ - ( ))';
    } else if (!/\d{10}/.test(formData.clientPhone.replace(/\D/g, ''))) {
      newErrors.clientPhone = 'El teléfono debe tener al menos 10 dígitos';
    }

    // Validar dirección: no vacía, sin números al inicio
    if (!formData.clientAddress.trim()) {
      newErrors.clientAddress = 'La dirección es requerida';
    } else if (formData.clientAddress.trim().length < 5) {
      newErrors.clientAddress = 'La dirección debe tener al menos 5 caracteres';
    }

    // Validar provincia
    if (!formData.clientProvince.trim()) {
      newErrors.clientProvince = 'La provincia es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const orderData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        clientCountry: formData.clientCountry,
        clientProvince: formData.clientProvince,
        additionalMessage: formData.additionalMessage,
        items: items,
        totalAmount: totalPrice,
      };

      const order = await createOrder(orderData);
      setCreatedOrderNumber(order.orderNumber);
      setOrderCreated(true);

      toast({
        title: 'Éxito',
        description: `Orden ${order.orderNumber} creada correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear la orden',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Tu carrito está vacío</h1>
          <p className="mt-2 text-muted-foreground">Agregá productos para verlos acá</p>
          <Link href="/productos">
            <Button className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ver productos
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const whatsappMessage = items.map((item) => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');

  const fullWhatsappMessage = `Hola MOK! Quiero hacer el siguiente pedido:\n\n${whatsappMessage}\n\nTotal: ${formatPrice(totalPrice)}`;

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/productos" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Seguir comprando
        </Link>

        <h1 className="text-2xl font-bold sm:text-3xl">Tu Carrito</h1>
        <p className="mt-1 text-muted-foreground">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </p>

        {/* Cart Items */}
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Precio: {formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => removeItem(item._id || item.id)} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Eliminar producto">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary disabled:opacity-50">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Resumen de Carrito */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Formulario de Cliente */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Datos de Envío</h2>

              {orderCreated ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-green-900 mb-2">¡Orden Creada Exitosamente!</h3>
                  <p className="text-green-800 mb-4">Tu número de orden es:</p>
                  <p className="text-2xl font-bold text-green-900 mb-4">{createdOrderNumber}</p>
                  <p className="text-sm text-green-700 mb-6">Guarda este número para hacer seguimiento de tu pedido</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setOrderCreated(false);
                        clearCart();
                      }}
                      className="flex-1"
                    >
                      Hacer otro pedido
                    </Button>
                    <Link href="/productos" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Volver a productos
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitOrder();
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Permitir solo letras, espacios y tildes
                          const cleanValue = value.replace(/[^a-záéíóúñ\s]/gi, '');
                          setFormData({ ...formData, clientName: cleanValue });
                          if (errors.clientName) setErrors({ ...errors, clientName: '' });
                        }}
                        placeholder="Tu nombre"
                        className={errors.clientName ? 'border-red-500' : ''}
                      />
                      {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => {
                          setFormData({ ...formData, clientEmail: e.target.value });
                          if (errors.clientEmail) setErrors({ ...errors, clientEmail: '' });
                        }}
                        placeholder="tu@email.com"
                        className={errors.clientEmail ? 'border-red-500' : ''}
                      />
                      {errors.clientEmail && <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono *</label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Permitir solo números, espacios, +, -, paréntesis
                          const cleanValue = value.replace(/[^\d\s\+\-\(\)]/g, '');
                          setFormData({ ...formData, clientPhone: cleanValue });
                          if (errors.clientPhone) setErrors({ ...errors, clientPhone: '' });
                        }}
                        placeholder="+54 9 11 1234 5678"
                        className={errors.clientPhone ? 'border-red-500' : ''}
                      />
                      {errors.clientPhone && <p className="text-xs text-red-500 mt-1">{errors.clientPhone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Dirección *</label>
                      <Input
                        value={formData.clientAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, clientAddress: e.target.value });
                          if (errors.clientAddress) setErrors({ ...errors, clientAddress: '' });
                        }}
                        placeholder="Calle 123, Apto 4B"
                        className={errors.clientAddress ? 'border-red-500' : ''}
                      />
                      {errors.clientAddress && <p className="text-xs text-red-500 mt-1">{errors.clientAddress}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">País *</label>
                      <Select value={formData.clientCountry} onValueChange={(value) => setFormData({ ...formData, clientCountry: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Argentina">Argentina</SelectItem>
                          <SelectItem value="Chile">Chile</SelectItem>
                          <SelectItem value="Uruguay">Uruguay</SelectItem>
                          <SelectItem value="Paraguay">Paraguay</SelectItem>
                          <SelectItem value="Brasil">Brasil</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Provincia/Estado *</label>
                      <Input
                        value={formData.clientProvince}
                        onChange={(e) => {
                          setFormData({ ...formData, clientProvince: e.target.value });
                          if (errors.clientProvince) setErrors({ ...errors, clientProvince: '' });
                        }}
                        placeholder="Buenos Aires"
                        className={errors.clientProvince ? 'border-red-500' : ''}
                      />
                      {errors.clientProvince && <p className="text-xs text-red-500 mt-1">{errors.clientProvince}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Mensaje Adicional (opcional)</label>
                    <Textarea value={formData.additionalMessage} onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })} placeholder="Ej: Enviar con cuidado, es un regalo..." maxLength={500} className="resize-none" rows={3} />
                    <p className="text-xs text-muted-foreground mt-1">{formData.additionalMessage.length}/500</p>
                  </div>

                  <Button type="submit" disabled={orderLoading} className="w-full gap-2">
                    {orderLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Crear Orden de Compra
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 sticky top-4">
              <h3 className="font-bold mb-4">Total del Pedido</h3>
              <div className="text-3xl font-bold mb-6">{formatPrice(totalPrice)}</div>
              <Button variant="outline" className="w-full mb-3" onClick={() => setOpenConfirm(true)}>
                Vaciar carrito
              </Button>
              <Link href="/productos" className="block">
                <Button variant="outline" className="w-full">
                  Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmación Vaciar Carrito */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Vaciar carrito?</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro que deseas vaciar el carrito? Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearCart();
                setOpenConfirm(false);
              }}
            >
              Vaciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
