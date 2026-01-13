import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-primary-foreground">
      <div className="absolute inset-0 bg-[url('/argentine-football-stadium-night-atmosphere.jpg')] bg-cover bg-center opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">Vestí a tu equipo con la camiseta que se merecen</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">Camisetas 100% personalizadas para tu equipo amateur, torneo o liga. Vos elegís los colores, el diseño, nombre, número y escudo. Calidad premium, hecha en Argentina.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/productos" className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-200">
              Ver Productos
            </Link>
            <Link href="https://wa.me/5491112345678?text=Hola%20MOK!%20Quiero%20consultar%20por%20camisetas%20personalizadas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gray-800">
              <MessageCircle className="h-5 w-5" />
              Consultá por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
