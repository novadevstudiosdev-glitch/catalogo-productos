import { getProductBySlug, products } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/product-detail-client"

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
