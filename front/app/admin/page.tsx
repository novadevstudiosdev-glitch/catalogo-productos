'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Product, Order } from '@/lib/types';
import { getProducts, getOrders, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import { OverviewTab } from '@/components/admin/overview-tab';
import { OrdersTab } from '@/components/admin/orders-tab';
import { ProductsTab } from '@/components/admin/products-tab';
import { AnalyticsTab } from '@/components/admin/analytics-tab';
import { ProductFormModal } from '@/components/product-form-modal';
import type { CreateProductInput } from '@/lib/products';
import { BarChart3, Package, TrendingUp, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([getProducts(), getOrders()]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: CreateProductInput) => {
    try {
      // Adaptar la categoría al tipo correcto
      const category = data.categoria === 'Argentine' || data.categoria === 'International' || data.categoria === 'Custom' ? data.categoria : 'Argentine';
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        slug: data.nombre.toLowerCase().replace(/\s+/g, '-'),
        name: data.nombre,
        description: data.descripcion,
        price: data.precio,
        originalPrice: data.precioOriginal,
        image: data.imagen,
        category: category as Product['category'],
        stock: data.stock,
        sizes: [],
        isOnSale: data.enOferta,
        createdAt: new Date().toISOString(),
      };

      await createProduct(newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      setIsFormOpen(false);
      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el producto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateProduct = async (data: CreateProductInput) => {
    if (!selectedProduct?.id) return;
    try {
      const category = data.categoria === 'Argentine' || data.categoria === 'International' || data.categoria === 'Custom' ? data.categoria : 'Argentine';
      const updatedProduct: Product = {
        ...selectedProduct,
        name: data.nombre,
        description: data.descripcion,
        price: data.precio,
        originalPrice: data.precioOriginal,
        image: data.imagen,
        category: category as Product['category'],
        stock: data.stock,
        isOnSale: data.enOferta,
      };

      await updateProduct(selectedProduct.id, updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)));
      setSelectedProduct(null);
      setIsFormOpen(false);
      toast({
        title: 'Éxito',
        description: 'Producto actualizado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: 'Éxito',
        description: 'Producto eliminado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateProductClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // No reset/demo/analytics actions: backend only

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 mx-auto flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Cargando panel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header & Tabs (fixed at top of content) */}
      <div className="shrink-0 p-4 sm:p-6 bg-background z-10">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona productos, órdenes y analíticas en un único lugar</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Órdenes</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content: single scroll area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 h-full overflow-auto p-4 sm:p-6">
            <TabsContent value="overview" className="h-full">
              <OverviewTab products={products} orders={orders} onCreateProduct={handleCreateProductClick} />
            </TabsContent>
            <TabsContent value="orders" className="h-full">
              <OrdersTab orders={orders} />
            </TabsContent>
            <TabsContent value="products" className="h-full">
              <ProductsTab products={products} onCreateProduct={handleCreateProductClick} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal open={isFormOpen} onOpenChange={setIsFormOpen} product={selectedProduct as any} onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct} categories={Array.from(new Set(products.map((p) => p.category).filter(Boolean)))} isLoading={false} />
    </div>
  );
}
