// Products CRUD page for admin
'use client';
import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import type { Product as AppProduct } from '@/lib/types';

const CATEGORY_LABELS: Record<string, string> = {
  Argentine: 'Argentine',
  International: 'International',
  Custom: 'Custom',
};
function mapCategory(cat: string): AppProduct['category'] {
  if (cat === 'Deportes' || cat === 'Ropa' || cat === 'Hogar') return 'Argentine';
  if (cat === 'Electrónica' || cat === 'Juguetes' || cat === 'Libros') return 'International';
  return 'Custom';
}

function emptyProduct(): AppProduct {
  return {
    id: '',
    slug: '',
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Argentine',
    stock: 0,
    sizes: [],
    isOnSale: false,
    createdAt: new Date().toISOString(),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [editing, setEditing] = useState<AppProduct | null>(null);
  const [form, setForm] = useState<AppProduct>(emptyProduct());
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProducts().then((ps) => {
      // Adaptar los productos del backend al tipo AppProduct
      const mapped = ps.map((p: any) => ({
        id: p.id || p._id || '',
        slug: p.slug || p.nombre?.toLowerCase().replace(/\s+/g, '-') || '',
        name: p.name || p.nombre || '',
        description: p.description || p.descripcion || '',
        price: p.price ?? p.precio ?? 0,
        originalPrice: p.originalPrice ?? p.precioOriginal,
        image: p.image || p.imagen || '',
        category: mapCategory(p.category || p.categoria || ''),
        team: undefined,
        stock: p.stock ?? 0,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        isOnSale: p.isOnSale ?? p.enOferta ?? false,
        createdAt: p.createdAt || new Date().toISOString(),
      }));
      setProducts(mapped);
    });
  }, []);

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };
  const handleNew = () => {
    setEditing(null);
    setForm(emptyProduct());
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar producto?')) {
      await deleteProduct(id);
      // Aquí puedes refrescar la lista de productos si es necesario
    }
  };

  return (
    <div className="p-8 text-center text-muted-foreground">
      <h2>Este panel fue migrado. Usa el panel principal de administración.</h2>
    </div>
  );
}
