'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/products';
import { ConfirmDialog } from './confirm-dialog';
import { ProductFormModal } from '../product-form-modal';

interface ProductsTabProps {
  products: Product[];
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
}

interface ProductWithMetrics extends Product {
  views?: number;
  purchases?: number;
  revenue?: number;
  conversionRate?: number;
}

export function ProductsTab({ products, onCreateProduct, onEditProduct, onDeleteProduct }: ProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterOnSale, setFilterOnSale] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.categoria).filter((c): c is string => !!c)));
  }, [products]);

  // Filtrado y ordenamiento
  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => (p.name || '').toLowerCase().includes(term));
    }
    if (filterCategory !== 'all') {
      result = result.filter((p) => p.categoria === filterCategory);
    }
    if (filterOnSale === 'true') {
      result = result.filter((p) => p.enOferta);
    } else if (filterOnSale === 'false') {
      result = result.filter((p) => !p.enOferta);
    }
    if (filterStock === 'low') {
      result = result.filter((p) => (p.stock ?? 0) <= 10);
    } else if (filterStock === 'out') {
      result = result.filter((p) => (p.stock ?? 0) === 0);
    } else if (filterStock === 'in') {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    }
    result = [...result];
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.nombre || '').localeCompare(b.nombre || '');
      } else if (sortBy === 'price') {
        return (b.precio || 0) - (a.precio || 0);
      } else {
        return (b.stock ?? 0) - (a.stock ?? 0);
      }
    });
    return result;
  }, [products, searchTerm, filterCategory, filterOnSale, filterStock, sortBy]);

  const handleDelete = async (productId: string) => {
    try {
      await onDeleteProduct(productId);
      setDeleteConfirm(null);
    } catch (error) {
      // Manejo de error opcional
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-8">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold tracking-tight">Gestionar Productos</h2>
        <Button onClick={onCreateProduct} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Crear Producto
        </Button>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-xs sm:text-sm rounded-lg" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterOnSale} onValueChange={setFilterOnSale}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Oferta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">En oferta</SelectItem>
            <SelectItem value="false">Sin oferta</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStock} onValueChange={setFilterStock}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo stock</SelectItem>
            <SelectItem value="in">Con stock</SelectItem>
            <SelectItem value="low">Bajo stock (&lt;10)</SelectItem>
            <SelectItem value="out">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="text-xs sm:text-sm rounded-lg">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre (A-Z)</SelectItem>
            <SelectItem value="price">Mayor precio</SelectItem>
            <SelectItem value="stock">Mayor stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Products Table */}
      <Card className="rounded-2xl shadow-sm border border-border">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground rounded-l-xl">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground rounded-r-xl">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground bg-background rounded-xl">
                    No hay productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/40'} hover:bg-accent/60 rounded-xl`}>
                    <td className="px-4 py-3 font-medium truncate max-w-[180px] whitespace-nowrap align-middle rounded-l-xl">{product.nombre || product.name}</td>
                    <td className="px-4 py-3 align-middle">
                      <Badge variant="outline" className="rounded-full px-2 py-1 text-xs bg-muted/80 border-none text-muted-foreground font-medium">
                        {product.categoria}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap align-middle">${(product.precio ?? product.price ?? 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3 whitespace-nowrap align-middle">
                      <span className={(product.stock ?? 0) <= 0 ? 'text-red-600 font-bold' : (product.stock ?? 0) <= 10 ? 'text-yellow-600 font-semibold' : 'text-foreground'}>{product.stock ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-2 items-center">
                        {product.enOferta ? <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-xs rounded-full px-2 py-1 border-none">Oferta</Badge> : null}
                        {(product.stock ?? 0) === 0 ? <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs rounded-full px-2 py-1 border-none">Sin stock</Badge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle rounded-r-xl">
                      <div className="flex gap-2 justify-start">
                        <Button size="icon" variant="ghost" onClick={() => setEditProduct(product)} className="h-8 w-8 p-0" aria-label="Editar">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(product._id || product.id?.toString() || '')} className="h-8 w-8 p-0 text-red-600 hover:text-red-700" aria-label="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Edit Product Modal */}
      {editProduct && (
        <ProductFormModal
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={editProduct}
          onSubmit={async (data) => {
            await onEditProduct({ ...editProduct, ...data });
            setEditProduct(null);
          }}
          categories={categories.filter((c): c is string => !!c)}
        />
      )}
      {/* Delete Confirmation */}
      <ConfirmDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)} title="Eliminar Producto" description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer." danger confirmText="Eliminar" onConfirm={() => handleDelete(deleteConfirm!)} />
    </div>
  );
}
