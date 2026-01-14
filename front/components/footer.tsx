import Link from 'next/link';
import { Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-semibold">MOK Store</span>
            <p className="text-sm text-muted-foreground mt-1">Tecnología y más</p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/productos" className="hover:text-foreground transition-colors">
              Productos
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contacto
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Sobre nosotros
            </Link>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:opacity-75" style={{ color: '#986459' }}>
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="transition-colors hover:opacity-75" style={{ color: '#987977' }}>
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="mailto:contacto@mokstore.com" className="transition-colors hover:opacity-75" style={{ color: '#7D6470' }}>
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} MOK Store. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
