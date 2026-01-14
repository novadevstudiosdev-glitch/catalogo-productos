import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id?: string | number;
  _id?: string;
  slug?: string;
  name?: string;
  description?: string;
  price?: string | number;
  image?: string;
  isCustom?: boolean;
  stock?: number;
  enOferta?: boolean;
  precioOriginal?: number;
}

export function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart?: (product: Product) => void }) {
  const displayPrice = product.price;
  const productId = product._id || product.id || product.slug;
  const productLink = `/productos/${productId}`;

  // Calcular descuento
  const discount = product.enOferta && product.precioOriginal && product.price ? Math.round(((parseFloat(product.precioOriginal.toString()) - parseFloat(product.price.toString())) / parseFloat(product.precioOriginal.toString())) * 100) : 0;

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image src={product.image || '/placeholder.svg'} alt={product.name || 'Producto'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isCustom && <Badge className="bg-foreground">Destacado</Badge>}
          {product.enOferta && discount > 0 && (
            <Badge variant="destructive" className="text-white">
              -{discount}%
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="bg-red-600 text-white">
              Sin stock
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-3 flex items-center justify-between mb-3 flex-grow">
          <div className="flex flex-col">
            <span className="text-lg font-bold">{displayPrice}</span>
            {product.enOferta && product.precioOriginal && <span className="text-xs text-muted-foreground line-through">${product.precioOriginal.toLocaleString('es-AR')}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={productLink} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver detalles
            </Button>
          </Link>
          {onAddToCart && (
            <Button size="sm" onClick={() => onAddToCart(product)} disabled={product.stock === 0} title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'} className="gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Carrito</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
