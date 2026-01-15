'use client';

import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart-context';
import { getUniqueCategories, type Product, type CreateProductInput } from '@/lib/products';
import { ProductFormModal } from './product-form-modal';
import { Plus, Edit2, Trash2, ShoppingCart, AlertCircle, Loader2, CheckCircle2, Trash } from 'lucide-react';

interface ProductsAdminProps {
  products: Product[];
  onCreateProduct: (data: CreateProductInput) => Promise<void>;
  onUpdateProduct: (id: string, data: CreateProductInput) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProductsAdmin({ products, onCreateProduct, onUpdateProduct, onDeleteProduct, isLoading = false }: ProductsAdminProps) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const categories = getUniqueCategories(products);

  // Filtrar productos por categoría
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.categoria === selectedCategory));
    }
  }, [products, selectedCategory]);

  const handleCreateProduct = async (data: CreateProductInput) => {
    try {
      setSubmitting(true);
      await onCreateProduct(data);
      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear el producto',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (data: CreateProductInput) => {
    if (!selectedProduct?._id) return;
    try {
      setSubmitting(true);
      // Conversión de tipos y mapeo de campos
      const payload: CreateProductInput = {
        nombre: String(data.nombre ?? data.name ?? selectedProduct.nombre ?? ''),
        descripcion: String(data.descripcion ?? data.description ?? selectedProduct.descripcion ?? ''),
        precio: Number(data.precio ?? data.price ?? selectedProduct.precio ?? 0),
        precioOriginal: data.precioOriginal !== undefined ? Number(data.precioOriginal) : data.originalPrice !== undefined ? Number(data.originalPrice) : selectedProduct.precioOriginal ?? undefined,
        imagen: String(data.imagen ?? data.image ?? selectedProduct.imagen ?? ''),
        categoria: String(data.categoria ?? data.category ?? selectedProduct.categoria ?? ''),
        stock: Number(data.stock ?? selectedProduct.stock ?? 0),
        enOferta: Boolean(data.enOferta ?? data.isOnSale ?? selectedProduct.enOferta ?? false),
      };
      await onUpdateProduct(selectedProduct._id, payload);
      setSelectedProduct(null);
      // Refrescar la lista de productos si existe función refetch
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('products-updated'));
      }
      toast({
        title: 'Éxito',
        description: 'Producto actualizado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el producto',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirm) return;
    try {
      setSubmitting(true);
      const deletedProduct = products.find((p) => p._id === deleteConfirm);
      await onDeleteProduct(deleteConfirm);
      toast({
        title: '✓ Producto eliminado',
        description: `"${deletedProduct?.nombre || 'Producto'}" fue eliminado correctamente`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'Error al eliminar el producto',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
      setDeleteConfirm(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: 'Sin stock',
        description: 'Este producto no tiene stock disponible',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      _id: product._id,
      id: product._id || product.id || '',
      name: product.nombre || product.name || 'Producto',
      price: product.precio || product.price || 0,
      image: product.imagen || product.image || '/placeholder.svg',
      stock: product.stock || 0,
      quantity: 1,
    });

    toast({
      title: 'Agregado al carrito',
      description: `${product.nombre || product.name} fue agregado`,
    });
  };

  const calculateDiscount = (price: number, originalPrice?: number): number => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <>
      <ProductFormModal
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        categories={categories}
        isLoading={submitting || isLoading}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleDeleteProduct} disabled={submitting} className="bg-red-600 hover:bg-red-700">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
          <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
        {/* Filtro y botón crear */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filtrar por:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
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
          </div>
          <Button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            disabled={isLoading || submitting}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Producto
          </Button>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left font-semibold">Imagen</th>
                <th className="p-3 text-left font-semibold">Nombre</th>
                <th className="p-3 text-left font-semibold">Categoría</th>
                <th className="p-3 text-right font-semibold">Precio</th>
                <th className="p-3 text-right font-semibold">Stock</th>
                <th className="p-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const discount = calculateDiscount(product.precio || 0, product.precioOriginal);
                return (
                  <tr key={product._id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3">
                      <div className="relative h-16 w-16 rounded border border-border overflow-hidden flex-shrink-0 bg-secondary">
                        {product.imagen ? (
                          <img
                            src={product.imagen}
                            alt={product.nombre || ''}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="line-clamp-1">{product.nombre || 'Sin nombre'}</span>
                        {product.enOferta && (
                          <Badge variant="default" className="text-xs flex-shrink-0">
                            -{discount}%
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{product.categoria}</td>
                    <td className="p-3 text-right font-semibold">${product.precio?.toLocaleString('es-AR')}</td>
                    <td className="p-3 text-right">
                      <span className={product.stock > 0 ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>{product.stock}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleAddToCart(product)} disabled={product.stock === 0 || isLoading || submitting} title="Agregar al carrito" className="gap-1">
                          <ShoppingCart className="h-4 w-4" />
                          <span className="hidden sm:inline">Carrito</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsFormOpen(true);
                          }}
                          disabled={isLoading || submitting}
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(product._id!)} disabled={isLoading || submitting} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{products.length === 0 ? 'No hay productos disponibles' : 'No hay productos en esta categoría'}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Total de productos</div>
            <div className="mt-2 text-2xl font-bold">{products.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">En esta categoría</div>
            <div className="mt-2 text-2xl font-bold">{filteredProducts.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Stock total</div>
            <div className="mt-2 text-2xl font-bold">{filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
