'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const itemId = (product._id ?? product.id ?? 1) as number | string;
    addItem({
      _id: itemId,
      id: itemId,
      name: product.nombre || product.name || 'Producto sin nombre',
      price: product.precio || product.price || 0,
      image: product.imagen || product.image || '/placeholder.svg',
      stock: product.stock || 0,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/productos" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
            <Image src={product.image || product.imagen || '/placeholder.svg'} alt={product.name || product.nombre || 'Producto'} fill className="object-cover" priority />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name || product.nombre}</h1>
            <p className="mt-2 text-2xl font-bold">{product.priceFormatted || `$${product.precio}`}</p>
            <p className="mt-4 text-muted-foreground">{product.description || product.descripcion}</p>

            {/* Stock Info */}
            {product.stock !== undefined && (
              <div className="mt-6">
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}</p>
              </div>
            )}

            {/* Offer Badge */}
            {product.enOferta && product.precioOriginal && product.precio && (
              <div className="mt-4 rounded-md bg-red-100 p-3">
                <p className="text-sm font-medium text-red-800">¡En Oferta! Ahorrás ${(product.precioOriginal - product.precio).toLocaleString('es-AR')}</p>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mt-8 flex gap-4">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2">
                <ShoppingCart className="h-5 w-5" />
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Agregado al carrito</span>
                  </>
                ) : (
                  'Agregar al carrito'
                )}
              </Button>
            </div>

            {/* Product Information Table */}
            <div className="mt-8 rounded-lg border border-border bg-card p-4">
              <h3 className="mb-4 text-lg font-semibold">Información del Producto</h3>
              <div className="space-y-3">
                {product.nombre && (
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <span className="font-medium text-muted-foreground">Nombre:</span>
                    <span className="font-semibold text-right">{product.nombre}</span>
                  </div>
                )}
                {product.precio && (
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <span className="font-medium text-muted-foreground">Precio:</span>
                    <span className="font-semibold">${product.precio.toLocaleString('es-AR')}</span>
                  </div>
                )}
                {product.precioOriginal && product.enOferta && (
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <span className="font-medium text-muted-foreground">Precio Original:</span>
                    <span className="font-semibold line-through text-muted-foreground">${product.precioOriginal.toLocaleString('es-AR')}</span>
                  </div>
                )}
                {product.stock !== undefined && (
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <span className="font-medium text-muted-foreground">Stock:</span>
                    <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}</span>
                  </div>
                )}
                {product.categria && (
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <span className="font-medium text-muted-foreground">Categoría:</span>
                    <span className="font-semibold">{product.categria}</span>
                  </div>
                )}
                {product.enOferta && (
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-muted-foreground">Estado:</span>
                    <span className="font-semibold text-[#986459]">En Oferta</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
