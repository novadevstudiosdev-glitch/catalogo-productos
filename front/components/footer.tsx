import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">MOK</span>
            <span className="text-sm text-muted-foreground">Store</span>
          </div>
          <Link href="https://wa.me/5491112345678?text=Hola%20MOK%20Store!%20Tengo%20una%20consulta" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-green-500">
            <MessageCircle className="h-4 w-4" />
            Contactanos por WhatsApp
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} MOK Store. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
