import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Camisetas
        </Link>

        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/">Inicio</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
