import { useState, useCallback, useEffect } from 'react';
import { getProductsFromAPI, createProduct, updateProduct, deleteProduct, type Product, type CreateProductInput } from '@/lib/products';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProductAsync: (input: CreateProductInput) => Promise<Product | null>;
  updateProductAsync: (id: string, input: CreateProductInput) => Promise<Product | null>;
  deleteProductAsync: (id: string) => Promise<boolean>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductsFromAPI();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos automáticamente cuando el hook se monta y refrescar por evento
  useEffect(() => {
    if (!hasInitialized) {
      refetch();
      setHasInitialized(true);
    }
    // Listener para refrescar productos cuando se actualiza
    const handler = () => refetch();
    window.addEventListener('products-updated', handler);
    return () => {
      window.removeEventListener('products-updated', handler);
    };
  }, []);

  const createProductAsync = useCallback(async (input: CreateProductInput) => {
    try {
      setError(null);
      const product = await createProduct(input);
      if (product) {
        setProducts((prev) => [...prev, product]);
      }
      return product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      setError(message);
      throw err;
    }
  }, []);

  const updateProductAsync = useCallback(async (id: string, input: CreateProductInput) => {
    try {
      setError(null);
      const product = await updateProduct(id, input);
      if (product) {
        setProducts((prev) => prev.map((p) => (p._id === id ? product : p)));
      }
      return product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(message);
      throw err;
    }
  }, []);

  const deleteProductAsync = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(message);
      throw err;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch,
    createProductAsync,
    updateProductAsync,
    deleteProductAsync,
  };
}
