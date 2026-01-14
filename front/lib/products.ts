const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Product {
  _id?: string;
  id?: number;
  nombre?: string;
  name?: string;
  slug?: string;
  descripcion?: string;
  description?: string;
  precio?: number;
  price?: number;
  priceFormatted?: string;
  imagen?: string;
  image?: string;
  categoria?: string;
  stock?: number;
  enOferta?: boolean;
  precioOriginal?: number;
  disponible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
  imagen: string;
  categoria: string;
  stock: number;
  enOferta: boolean;
}

// Función para obtener todos los productos del backend
export async function getProductsFromAPI(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }

    const data = await response.json();

    // Mapear los productos del backend al formato del frontend
    return (data.data || []).map((product: any) => ({
      _id: product._id,
      id: product._id, // Usar el mismo _id para consistencia
      slug: product.nombre?.toLowerCase().replace(/\s+/g, '-'),
      nombre: product.nombre,
      name: product.nombre,
      descripcion: product.descripcion,
      description: product.descripcion,
      precio: product.precio,
      price: product.precio,
      priceFormatted: `$${product.precio?.toLocaleString('es-AR')}`,
      imagen: product.imagen,
      image: product.imagen,
      categoria: product.categoria,
      stock: product.stock,
      enOferta: product.enOferta,
      precioOriginal: product.precioOriginal,
      disponible: product.disponible,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Función para obtener un producto por ID
export async function getProductByIdFromAPI(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const product = data.data;

    return {
      _id: product._id,
      id: product._id, // Usar el mismo _id para consistencia
      slug: product.nombre?.toLowerCase().replace(/\s+/g, '-'),
      nombre: product.nombre,
      name: product.nombre,
      descripcion: product.descripcion,
      description: product.descripcion,
      precio: product.precio,
      price: product.precio,
      priceFormatted: `$${product.precio?.toLocaleString('es-AR')}`,
      imagen: product.imagen,
      image: product.imagen,
      categoria: product.categoria,
      stock: product.stock,
      enOferta: product.enOferta,
      precioOriginal: product.precioOriginal,
      disponible: product.disponible,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Productos de fallback (por si el backend no está disponible)
// Productos de fallback vacío - ahora solo cargamos del backend
export const products: Product[] = [];

// CRUD Operations
export async function createProduct(input: CreateProductInput): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Error al crear producto');
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, input: CreateProductInput): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar producto');
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar producto');
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Validación de URL de imagen
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('unsplash.com') || url.includes('images.');
  } catch {
    return false;
  }
}

// Extraer categorías únicas
export function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set<string>();
  products.forEach((p) => {
    if (p.categoria) categories.add(p.categoria);
  });
  return Array.from(categories).sort();
}
