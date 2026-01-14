import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MOK Store | Tienda Online de Productos Variados',
  description: 'Descubrí una amplia variedad de productos: tecnología, ropa, juegos, regalos y más. Compra online seguro con envíos a toda Argentina.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} font-sans antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
