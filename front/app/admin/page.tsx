'use client';

import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductsAdmin } from '@/components/products-admin';

export default function AdminPage() {
  const { products, createProductAsync, updateProductAsync, deleteProductAsync } = useProducts();
  const { toast } = useToast();

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestor de Productos</h1>
          <p className="mt-2 text-muted-foreground">Administra el catálogo de productos</p>
        </div>

        <ProductsAdmin products={products} onCreateProduct={createProductAsync} onUpdateProduct={updateProductAsync} onDeleteProduct={deleteProductAsync} />
      </div>
    </section>
  );
}
