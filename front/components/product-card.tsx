import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id?: string | number;
  _id?: string;
  slug?: string;
  name?: string;
  description?: string;
  price?: string | number;
  image?: string;
  isCustom?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.price;
  const productId = product._id || product.id || product.slug;
  const productLink = `/productos/${productId}`;

  return (
    <Link href={productLink} className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image src={product.image || '/placeholder.svg'} alt={product.name || 'Producto'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        {product.isCustom && <div className="absolute top-3 left-3 rounded-md bg-foreground px-3 py-1 text-xs font-semibold text-primary-foreground">Destacado</div>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">{displayPrice}</span>
          <span className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-gray-800">Ver producto</span>
        </div>
      </div>
    </Link>
  );
}
