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
      id: Math.random(), // Generar ID temporal para compatibilidad
      slug: product.nombre?.toLowerCase().replace(/\s+/g, '-'),
      name: product.nombre,
      description: product.descripcion,
      price: product.precio,
      priceFormatted: `$${product.precio?.toLocaleString('es-AR')}`,
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
      id: Math.random(),
      slug: product.nombre?.toLowerCase().replace(/\s+/g, '-'),
      name: product.nombre,
      description: product.descripcion,
      price: product.precio,
      priceFormatted: `$${product.precio?.toLocaleString('es-AR')}`,
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
