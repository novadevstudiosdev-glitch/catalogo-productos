'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const whatsappMessage = items.map((item) => `- ${item.name} (${item.customization.size}, ${item.customization.color})${item.customization.personalized ? ` [${item.customization.name || ''} #${item.customization.number || ''}]` : ''} x${item.quantity}`).join('\n');

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
          {items.map((item, index) => (
            <div key={`${item.id}-${item.customization.size}-${item.customization.color}-${index}`} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Talle: {item.customization.size} | Color: {item.customization.color}
                    </p>
                    {item.customization.personalized && (
                      <p className="text-sm text-muted-foreground">
                        Personalización: {item.customization.name || '-'} #{item.customization.number || '-'}
                      </p>
                    )}
                    {item.customization.notes && <p className="text-xs text-muted-foreground italic">Notas: {item.customization.notes}</p>}
                  </div>
                  <button onClick={() => removeItem(item.id, item.customization)} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Eliminar producto">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.customization, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary disabled:opacity-50">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.customization, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary">
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
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">* La personalización puede afectar el precio final. Confirmamos por WhatsApp.</p>

          <Link href={`https://wa.me/5491112345678?text=${encodeURIComponent(fullWhatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600">
            <MessageCircle className="h-5 w-5" />
            Finalizar pedido por WhatsApp
          </Link>

          <Button variant="outline" className="mt-3 w-full bg-transparent" onClick={clearCart}>
            Vaciar carrito
          </Button>
        </div>
      </div>
    </section>
  );
}
