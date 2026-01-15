// Unified data layer for MOK store (localStorage only)
import type { Product, Order, AnalyticsEvent, Settings } from './types';
import { getProductsFromAPI, getProductByIdFromAPI, createProduct as createProductAPI, updateProduct as updateProductAPI, deleteProduct as deleteProductAPI, type CreateProductInput, type Product as BackendProduct } from './products';
import { Product as AppProduct } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- PRODUCTS ---
export async function getProducts(): Promise<AppProduct[]> {
  const backendProducts = await getProductsFromAPI();
  return backendProducts.map(mapBackendProductToAppProduct);
}
export async function getProductById(id: string): Promise<AppProduct | null> {
  const backendProduct = await getProductByIdFromAPI(id);
  return backendProduct ? mapBackendProductToAppProduct(backendProduct) : null;
}
export async function createProduct(product: AppProduct): Promise<AppProduct | null> {
  // Adapt AppProduct to CreateProductInput
  // Validar categoría
  const categoriasValidas = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros', 'Otros'];
  let categoriaFinal = categoriasValidas.find((cat) => cat.toLowerCase() === product.category?.toLowerCase()) || 'Otros';
  const input: CreateProductInput = {
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    precioOriginal: product.originalPrice,
    imagen: product.image,
    categoria: categoriaFinal,
    stock: product.stock,
    enOferta: product.isOnSale,
  };
  const backendProduct = await createProductAPI(input);
  return backendProduct ? mapBackendProductToAppProduct(backendProduct) : null;
}
export async function updateProduct(id: string, data: Partial<AppProduct>): Promise<AppProduct | null> {
  // Adapt Partial<AppProduct> to CreateProductInput (fill with defaults)
  // You may want to fetch the current product first for missing fields
  const current = await getProductById(id);
  if (!current) return null;
  const categoriasValidas = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros', 'Otros'];
  let categoriaFinal = categoriasValidas.find((cat) => cat.toLowerCase() === (data.category ?? current.category)?.toLowerCase()) || 'Otros';
  const input: CreateProductInput = {
    nombre: data.name ?? current.name,
    descripcion: data.description ?? current.description,
    precio: data.price ?? current.price,
    precioOriginal: data.originalPrice ?? current.originalPrice,
    imagen: data.image ?? current.image,
    categoria: categoriaFinal,
    stock: data.stock ?? current.stock,
    enOferta: data.isOnSale ?? current.isOnSale,
  };
  const backendProduct = await updateProductAPI(id, input);
  return backendProduct ? mapBackendProductToAppProduct(backendProduct) : null;
}
export async function deleteProduct(id: string): Promise<boolean> {
  return deleteProductAPI(id);
}

// Map backend Product to App Product
function mapBackendProductToAppProduct(p: BackendProduct): AppProduct {
  return {
    id: String(p.id || p._id || ''),
    slug: p.slug || p.nombre?.toLowerCase().replace(/\s+/g, '-') || '',
    name: p.name || p.nombre || '',
    description: p.description || p.descripcion || '',
    price: p.price ?? p.precio ?? 0,
    originalPrice: p.precioOriginal,
    image: p.image || p.imagen || '',
    category: (p.categoria || 'Argentine') as AppProduct['category'],
    team: undefined,
    stock: p.stock ?? 0,
    sizes: Array.isArray((p as any).sizes) ? (p as any).sizes : [],
    isOnSale: p.enOferta ?? false,
    createdAt: p.createdAt || new Date().toISOString(),
  };
}

// --- ORDERS ---
export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.data || []).map(mapBackendOrderToAppOrder);
}
export async function getOrderById(id: string): Promise<Order | null> {
  const res = await fetch(`${API_URL}/orders/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data ? mapBackendOrderToAppOrder(data.data) : null;
}

// Map backend Order to App Order
function mapBackendOrderToAppOrder(o: any): Order {
  return {
    id: String(o._id || o.id || ''),
    createdAt: o.createdAt || '',
    status: mapOrderStatus(o.status),
    customer: {
      name: o.clientName || '',
      email: o.clientEmail || '',
      phone: o.clientPhone || '',
    },
    shipping: {
      zone: o.clientProvince === 'CABA' ? 'CABA' : o.clientProvince === 'GBA' ? 'GBA' : 'Interior',
      address: o.clientAddress || '',
      city: '',
      province: o.clientProvince || '',
    },
    paymentMethod: o.paymentMethod || 'Mercado Pago',
    items: (o.items || []).map((item: any) => ({
      productId: String(item.productId || ''),
      name: item.productName || '',
      price: item.productPrice || 0,
      qty: item.quantity || 0,
    })),
    subtotal: o.totalAmount || 0,
    shippingCost: 0,
    total: o.totalAmount || 0,
    notes: o.notes || '',
  };
}

function mapOrderStatus(status: string): Order['status'] {
  switch (status) {
    case 'pendiente':
      return 'new';
    case 'procesando':
      return 'paid';
    case 'en-envío':
      return 'shipped';
    case 'enviado':
      return 'shipped';
    case 'entregado':
      return 'delivered';
    case 'cancelado':
      return 'cancelled';
    default:
      return 'new';
  }
}
export async function createOrder(order: Order): Promise<Order | null> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}
export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.ok;
}
export async function deleteOrder(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
  return res.ok;
}

// --- SETTINGS ---
export async function getSettings(): Promise<Settings | null> {
  const res = await fetch(`${API_URL}/settings`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}
export async function updateSettings(settings: Settings): Promise<boolean> {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return res.ok;
}
