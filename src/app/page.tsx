import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">Camisetas personalizadas</span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Tu camiseta,
            <span className="block text-gray-900">como vos la querés</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">Diseñamos camisetas de fútbol personalizadas con nombre, número y detalles únicos. Ideales para hinchas, equipos y regalos.</p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/productos" className="rounded-md bg-black px-8 py-4 text-white hover:bg-gray-800">
              Ver camisetas
            </Link>

            <Link href="/contacto" className="rounded-md border px-8 py-4 hover:bg-gray-100">
              Consultar por WhatsApp
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
              <h3 className="mt-4 text-lg font-semibold">Elegís el modelo</h3>
              <p className="mt-2 text-gray-600">Seleccioná el equipo, la temporada y el talle.</p>
            </div>

            <div>
              <span className="text-3xl font-bold">2</span>
              <h3 className="mt-4 text-lg font-semibold">Personalizás</h3>
              <p className="mt-2 text-gray-600">Agregá nombre, número y parches especiales.</p>
            </div>

            <div>
              <span className="text-3xl font-bold">3</span>
              <h3 className="mt-4 text-lg font-semibold">Recibís tu camiseta</h3>
              <p className="mt-2 text-gray-600">La producimos y te la enviamos a tu domicilio.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">¿Listo para crear tu camiseta?</h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">Escribinos y empezá hoy mismo tu diseño personalizado.</p>

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
