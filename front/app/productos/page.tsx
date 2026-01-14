'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { MessageCircle, Search, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart-context';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type SortOption = 'none' | 'asc' | 'desc';

export default function ProductosPage() {
  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  const { addItem } = useCart();

  // Estados para filtrado y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoria || p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  // Filtrado y ordenamiento con useMemo
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Búsqueda por nombre (case-insensitive)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((p) => (p.nombre || p.name || '').toLowerCase().includes(searchLower) || (p.descripcion || p.description || '').toLowerCase().includes(searchLower));
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      result = result.filter((p) => (p.categoria || p.category) === selectedCategory);
    }

    // Ordenamiento por precio
    if (sortBy !== 'none') {
      result.sort((a, b) => {
        const priceA = a.precio || (typeof a.price === 'string' ? parseFloat(a.price.replace('$', '').replace('.', '')) : a.price) || 0;
        const priceB = b.precio || (typeof b.price === 'string' ? parseFloat(b.price.replace('$', '').replace('.', '')) : b.price) || 0;

        return sortBy === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

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

  // Resetear todos los filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('none');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'none';

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-muted-foreground">Descubre nuestra variedad de productos de calidad</p>
        </div>

        {/* Controles de búsqueda y filtrado */}
        {!loading && products.length > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
              {/* Barra de búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Limpiar búsqueda">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filtro por categoría */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ordenamiento por precio */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin ordenar</SelectItem>
                  <SelectItem value="asc">Menor a mayor precio</SelectItem>
                  <SelectItem value="desc">Mayor a menor precio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botón para resetear filtros */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Resultado de búsqueda */}
            {filteredProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
              </p>
            )}
          </div>
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-muted-foreground mb-4">{searchTerm || selectedCategory !== 'all' ? 'No encontramos productos que coincidan con tus filtros.' : 'No hay productos disponibles'}</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters} className="gap-1">
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
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
    </section>
  );
}
