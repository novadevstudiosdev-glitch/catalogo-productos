import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">MOK Store</span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Todo lo que necesitás
            <span className="block text-gray-900">en un mismo lugar</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">En MOK Store encontrás tecnología, ropa, juegos, regalos y productos para el día a día. Envíos a toda Argentina con garantía en cada compra.</p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/productos" className="rounded-md bg-black px-8 py-4 text-white hover:bg-gray-800">
              Ver Productos
            </Link>

            <Link href="/contacto" className="rounded-md border px-8 py-4 hover:bg-gray-100">
              Contactanos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Personalización total</h3>
            <p className="mt-2 text-gray-600">Nombre, número, parches y modelos clásicos o actuales.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Calidad premium</h3>
            <p className="mt-2 text-gray-600">Telas cómodas, resistentes y con excelente terminación.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Entrega rápida</h3>
            <p className="mt-2 text-gray-600">Producción ágil y envíos a todo el país.</p>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Cómo funciona</h2>

          <div className="grid gap-10 sm:grid-cols-3 text-center">
            <div>
              <span className="text-3xl font-bold">1</span>
              <h3 className="mt-4 text-lg font-semibold">Explorá el catálogo</h3>
              <p className="mt-2 text-gray-600">Descubrí cientos de productos: tecnología, ropa, juegos y más.</p>
            </div>

            <div>
              <span className="text-3xl font-bold">2</span>
              <h3 className="mt-4 text-lg font-semibold">Agregá al carrito</h3>
              <p className="mt-2 text-gray-600">Elegí lo que te gusta y agregá a tu carrito de compras.</p>
            </div>

            <div>
              <span className="text-3xl font-bold">3</span>
              <h3 className="mt-4 text-lg font-semibold">Recibí en tu casa</h3>
              <p className="mt-2 text-gray-600">Completá tu compra y recibí tu pedido en toda Argentina.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">¿Listo para empezar a comprar?</h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">Miles de clientes confían en MOK Store. Explorá nuestro catálogo.</p>

          <div className="mt-8">
            <Link href="/contacto" className="rounded-md bg-white px-8 py-4 text-gray-900 hover:bg-gray-200">
              Contactar ahora
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
