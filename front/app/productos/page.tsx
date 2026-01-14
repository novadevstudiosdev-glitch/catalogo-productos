'use client';

import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart-context';

export default function ProductosPage() {
  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast({
        title: 'Sin stock',
        description: 'Este producto no tiene stock disponible',
        variant: 'destructive',
      });
      return;
    }

    const itemId = product._id || product.id || product.slug;
    addItem({
      _id: itemId,
      id: itemId,
      name: product.name || 'Producto',
      price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '').replace('.', '')) : product.price || 0,
      image: product.image || '/placeholder.svg',
      stock: product.stock || 0,
      quantity: 1,
    });

    toast({
      title: 'Agregado al carrito',
      description: `${product.name} fue agregado al carrito`,
    });
  };

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-muted-foreground">Descubre nuestra variedad de productos de calidad</p>
        </div>

        {error && <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={{
                  id: product._id || product.id,
                  slug: product.slug,
                  name: product.name || product.nombre || '',
                  description: product.description || product.descripcion || '',
                  price: product.priceFormatted || `$${product.precio?.toLocaleString('es-AR')}`,
                  image: product.image || product.imagen || '/placeholder.svg',
                  stock: product.stock || 0,
                  enOferta: product.enOferta,
                  precioOriginal: product.precioOriginal,
                }}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            <p>No hay productos disponibles</p>
            <Link href="https://wa.me/5491112345678?text=Hola%20MOK%20Store!%20Tengo%20una%20consulta" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600">
              <MessageCircle className="h-5 w-5" />
              Contactanos por WhatsApp
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
