import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">¿Listo para empezar a comprar?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Miles de clientes confían en MOK Store. Explorá nuestro catálogo o contactanos para más información.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="https://wa.me/5491112345678?text=Hola%20MOK%20Store!%20Tengo%20una%20consulta" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600">
            <MessageCircle className="h-5 w-5" />
            Contactanos por WhatsApp
          </Link>
          <Link href="/productos" className="inline-flex items-center justify-center rounded-md border border-gray-600 px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-gray-800">
            Ver Productos
          </Link>
        </div>
      </div>
    </section>
  );
}
