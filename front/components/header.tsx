'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Settings, Package, Search } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { totalItems } = useCart();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">MOK</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Productos
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contacto
          </Link>

          {/* Admin Dropdown */}
          <div className="relative">
            <button onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Settings className="h-4 w-4" />
              Admin
            </button>
            {isAdminMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg">
                <Link href="/admin" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary first:rounded-t-md flex items-center gap-2" onClick={() => setIsAdminMenuOpen(false)}>
                  <Package className="h-4 w-4" />
                  Gestor de Productos
                </Link>
                <Link href="/admin/orders" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary last:rounded-b-md flex items-center gap-2" onClick={() => setIsAdminMenuOpen(false)}>
                  <Search className="h-4 w-4" />
                  Búsqueda de Órdenes
                </Link>
              </div>
            )}
          </div>

          <Link href="/carrito" className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-primary-foreground">{totalItems > 99 ? '99+' : totalItems}</span>}
          </Link>
        </nav>

        {/* Mobile Menu Button & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/carrito" className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-primary-foreground">{totalItems > 99 ? '99+' : totalItems}</span>}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-muted-foreground hover:text-foreground">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col">
            <Link href="/" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/contacto" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
              Contacto
            </Link>
            <div className="border-t border-border">
              <button onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)} className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </button>
              {isAdminMenuOpen && (
                <div className="bg-secondary">
                  <Link href="/admin" className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    Gestor de Productos
                  </Link>
                  <Link href="/admin/orders" className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    Búsqueda de Órdenes
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
