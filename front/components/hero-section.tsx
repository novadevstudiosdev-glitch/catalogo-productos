import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-primary-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/BackgroundImagen.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">Todo lo que necesitás en un mismo lugar</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-200">En MOK Store encontrás tecnología, ropa, juegos, rompecabezas, regalos y productos para el día a día. Envíos a todo el país con garantía en cada compra.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/productos" className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-100" style={{ color: '#986459' }}>
              Ver Productos
            </Link>
            <Link href="https://wa.me/5491112345678?text=Hola%20MOK!%20Quiero%20conocer%20mas%20sobre%20tus%20productos" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90" style={{ borderColor: '#987977', borderWidth: '2px', backgroundColor: 'transparent' }}>
              <MessageCircle className="h-5 w-5" />
              Contactanos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
