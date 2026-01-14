'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDetailClient } from '@/components/product-detail-client';
import type { Product } from '@/lib/products';
import { getProductByIdFromAPI } from '@/lib/products';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        // El slug puede ser el _id del producto o el nombre del producto
        const productData = await getProductByIdFromAPI(slug);

        if (!productData) {
          setError('Producto no encontrado');
          setProduct(null);
        } else {
          setProduct(productData);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-red-700 text-center">{error || 'Producto no encontrado'}</div>
        <button onClick={() => router.push('/productos')} className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-gray-800">
          Volver a productos
        </button>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
