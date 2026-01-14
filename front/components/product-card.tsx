import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';

const cartAnimationStyles = `
  @keyframes cartBounce {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  @keyframes cartSuccess {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; }
    100% { opacity: 1; transform: scale(1); }
  }
  .cart-button-animate {
    animation: cartBounce 0.6s ease-in-out;
  }
  .cart-success-icon {
    animation: cartSuccess 0.4s ease-out;
  }
`;

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
  const [isAdding, setIsAdding] = React.useState(false);
  const displayPrice = product.price;
  const productId = product._id || product.id || product.slug;
  const productLink = `/productos/${productId}`;

  // Calcular descuento
  const discount = product.enOferta && product.precioOriginal && product.price ? Math.round(((parseFloat(product.precioOriginal.toString()) - parseFloat(product.price.toString())) / parseFloat(product.precioOriginal.toString())) * 100) : 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart && !isAdding) {
      setIsAdding(true);
      onAddToCart(product);
      setTimeout(() => setIsAdding(false), 600);
    }
  };

  return (
    <>
      <style>{cartAnimationStyles}</style>
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
              <Button size="sm" onClick={handleAddClick} disabled={product.stock === 0 || isAdding} title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'} className={`gap-1 ${isAdding ? 'cart-button-animate' : ''}`}>
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4 cart-success-icon" />
                    <span className="hidden sm:inline">¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Carrito</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
