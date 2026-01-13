import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { MessageCircle, Star } from "lucide-react"
import { products } from "@/lib/products"

export default function ProductosPage() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Camisetas de fútbol personalizables para equipos amateur, torneos y ligas
          </p>
        </div>

        {/* Featured Custom Product */}
        <div className="mt-12 overflow-hidden rounded-xl border-2 border-foreground bg-card">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square lg:aspect-auto">
              <img
                src="/custom-football-jersey-design-team-argentina-amate.jpg"
                alt="Camiseta 100% personalizada"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1 rounded-md bg-foreground px-3 py-1 text-sm font-semibold text-primary-foreground">
                <Star className="h-4 w-4" />
                Más Popular
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <h2 className="text-2xl font-bold sm:text-3xl">Camiseta 100% Personalizada para Tu Equipo</h2>
              <p className="mt-4 text-muted-foreground">
                Diseño totalmente a medida para tu equipo amateur, torneo de barrio o liga local. Vos nos mandás los
                colores, el nombre, número y la idea del escudo por WhatsApp, y nosotros armamos el diseño.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Diseño exclusivo para tu equipo
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Sublimación de alta calidad
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Nombre y número incluidos
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Escudo personalizado
                </li>
              </ul>
              <div className="mt-8">
                <p className="text-2xl font-bold">Desde $40.000</p>
                <p className="text-sm text-muted-foreground">Precio a convenir según cantidad y diseño</p>
              </div>
              <Link
                href="https://wa.me/5491112345678?text=Hola%20MOK!%20Quiero%20pedir%20un%20dise%C3%B1o%20personalizado%20para%20mi%20equipo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Pedir Diseño Personalizado
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold">Diseños Base Personalizables</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Elegí un diseño base y personalizalo con los colores, nombre y número de tu equipo
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.priceFormatted,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
