export interface Product {
  id: number
  slug: string
  name: string
  description: string
  price: number
  priceFormatted: string
  image: string
  isCustom?: boolean
  colors: string[]
  sizes: string[]
}

export const products: Product[] = [
  {
    id: 1,
    slug: "camiseta-celeste-blanca",
    name: "Camiseta Celeste y Blanca",
    description:
      "Estilo clásico albiceleste con diseño sublimado de alta calidad. Perfecta para equipos que buscan un look tradicional argentino. Tela respirable y resistente, ideal para partidos de fútbol amateur.",
    price: 45000,
    priceFormatted: "$45.000",
    image: "/light-blue-and-white-striped-football-jersey-argen.jpg",
    colors: ["Celeste", "Blanco", "Azul Marino"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    slug: "camiseta-azul-oro",
    name: "Camiseta Azul y Oro",
    description:
      "Diseño bicolor con detalles dorados que destacan. Inspirada en los colores clásicos del fútbol argentino. Sublimación premium que no se decolora con los lavados.",
    price: 45000,
    priceFormatted: "$45.000",
    image: "/blue-and-gold-football-jersey-boca-style.jpg",
    colors: ["Azul", "Dorado", "Negro"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    slug: "camiseta-roja-blanca",
    name: "Camiseta Roja y Blanca",
    description:
      "Franjas verticales clásicas rojas y blancas. Un diseño atemporal que nunca pasa de moda. Ideal para equipos que buscan un estilo distintivo y elegante.",
    price: 45000,
    priceFormatted: "$45.000",
    image: "/red-and-white-striped-football-jersey-river-style.jpg",
    colors: ["Rojo", "Blanco", "Negro"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    slug: "camiseta-negra-premium",
    name: "Camiseta Negra Premium",
    description:
      "Diseño minimalista negro con detalles blancos. Una camiseta elegante y moderna para equipos que quieren destacar con sobriedad. Acabado premium con costuras reforzadas.",
    price: 48000,
    priceFormatted: "$48.000",
    image: "/black-premium-football-jersey-minimal-design-white.jpg",
    colors: ["Negro", "Blanco", "Gris"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 5,
    slug: "camiseta-verde-blanca",
    name: "Camiseta Verde y Blanca",
    description:
      "Combinación verde bosque con blanco, fresca y distintiva. Perfecta para equipos que buscan un color diferente. Material de alta calidad con secado rápido.",
    price: 45000,
    priceFormatted: "$45.000",
    image: "/green-and-white-football-jersey-custom-design.jpg",
    colors: ["Verde", "Blanco", "Negro"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    slug: "camiseta-amarilla-azul",
    name: "Camiseta Amarilla y Azul",
    description:
      "Diseño vibrante amarillo con detalles azules. Una combinación llamativa que no pasa desapercibida en la cancha. Colores brillantes que se mantienen tras cada lavado.",
    price: 45000,
    priceFormatted: "$45.000",
    image: "/yellow-and-blue-football-jersey-vibrant-design.jpg",
    colors: ["Amarillo", "Azul", "Blanco"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
