'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { ProductFiltersSidebar, ProductFilters } from '@/components/product-filters-sidebar';

function ProductosPage() {
  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado de filtros único
  const [filters, setFilters] = useState<ProductFilters>({
    q: '',
    categories: [],
    minPrice: '',
    maxPrice: '',
    sort: 'new',
    onSale: false,
  });

  // Sincronizar filtros con la URL al montar
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || '';
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    const sort = searchParams.get('sort') || 'new';
    const sale = searchParams.get('sale') === '1';
    setFilters({
      q,
      categories: cat ? cat.split(',') : [],
      minPrice: min,
      maxPrice: max,
      sort,
      onSale: sale,
    });
    // eslint-disable-next-line
  }, []);

  // Actualizar la URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.categories.length > 0) params.set('cat', filters.categories.join(','));
    if (filters.minPrice) params.set('min', filters.minPrice);
    if (filters.maxPrice) params.set('max', filters.maxPrice);
    if (filters.sort && filters.sort !== 'new') params.set('sort', filters.sort);
    if (filters.onSale) params.set('sale', '1');
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line
  }, [filters]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoria || p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  // Filtrado y ordenamiento avanzado
  const filteredProducts = useMemo(() => {
    let result = [...products];
    // Buscar por nombre o descripción
    if (filters.q.trim()) {
      const searchLower = filters.q.toLowerCase();
      result = result.filter((p) => (p.nombre || p.name || '').toLowerCase().includes(searchLower) || (p.descripcion || p.description || '').toLowerCase().includes(searchLower));
    }
    // Filtrar por categorías
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.categoria || p.category));
    }
    // Filtrar por rango de precio
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter((p) => {
        const price = p.precio ?? p.price ?? 0;
        return price >= min;
      });
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter((p) => {
        const price = p.precio ?? p.price ?? 0;
        return price <= max;
      });
    }
    // Filtrar por oferta
    if (filters.onSale) {
      result = result.filter((p) => p.enOferta === true || p.isOnSale === true);
    }
    // Ordenar
    if (filters.sort === 'asc') {
      result.sort((a, b) => {
        const priceA = a.precio ?? a.price ?? 0;
        const priceB = b.precio ?? b.price ?? 0;
        return priceA - priceB;
      });
    } else if (filters.sort === 'desc') {
      result.sort((a, b) => {
        const priceA = a.precio ?? a.price ?? 0;
        const priceB = b.precio ?? b.price ?? 0;
        return priceB - priceA;
      });
    } else if (filters.sort === 'az') {
      result.sort((a, b) => {
        const nameA = (a.nombre || a.name || '').toLowerCase();
        const nameB = (b.nombre || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (filters.sort === 'new') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return result;
  }, [products, filters]);

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

  // Limpiar filtros
  const handleClear = () => {
    setFilters({
      q: '',
      categories: [],
      minPrice: '',
      maxPrice: '',
      sort: 'new',
      onSale: false,
    });
  };

  // Aplicar filtros (solo cierra el drawer en mobile, la lógica ya es reactiva)
  const handleApply = () => {};

  // Responsive: mostrar sidebar sticky en desktop, drawer en mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-muted-foreground">Descubre nuestra variedad de productos de calidad</p>
        </div>

        {/* Filtros y grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="lg:block hidden">
            <ProductFiltersSidebar filters={filters} setFilters={setFilters} categories={categories} onApply={handleApply} onClear={handleClear} isMobile={false} />
          </div>
          {/* Drawer en mobile */}
          <div className="lg:hidden mb-4">
            <ProductFiltersSidebar filters={filters} setFilters={setFilters} categories={categories} onApply={handleApply} onClear={handleClear} isMobile={true} />
          </div>

          {/* Contenido principal: grid y resultados */}
          <div className="flex-1">
            {/* Texto de resultados */}
            {!loading && products.length > 0 && (
              <p className="mb-4 text-sm text-muted-foreground">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
              </p>
            )}

            {/* Mensajes de error */}
            {error && <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

            {/* Loading */}
            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              </div>
            )}

            {/* Grid de productos */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
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

            {/* Sin resultados */}
            {!loading && products.length > 0 && filteredProducts.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">No encontramos productos que coincidan con tus filtros.</p>
              </div>
            )}

            {/* Sin productos disponibles */}
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
        </div>
      </div>
    </section>
  );
}

export default function ProductosPageWrapper() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Cargando...</div>}>
      <ProductosPage />
    </Suspense>
  );
}
