'use client';

import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { MessageCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProductsFromAPI, type Product } from '@/lib/products';

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsFromAPI();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-muted-foreground">Descubre nuestra variedad de productos de calidad</p>
        </div>

        {/* Product Grid */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold">Todos nuestros productos</h2>
          <p className="mt-2 text-sm text-muted-foreground">Explora nuestra colección completa</p>

          {error && <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-8 text-center text-muted-foreground">No hay productos disponibles</div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={{
                    id: product._id || product.id,
                    slug: product.slug,
                    name: product.name || '',
                    description: product.description || '',
                    price: product.priceFormatted || product.price?.toString(),
                    image: product.image || '/placeholder.svg',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
