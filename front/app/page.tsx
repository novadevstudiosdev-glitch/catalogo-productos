'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { HeroSection } from '@/components/hero-section';
import { BenefitsSection } from '@/components/benefits-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { CtaSection } from '@/components/cta-section';
import { Preloader } from '@/components/preloader';

const pageStyles = `
  @keyframes slideDownMajor {
    0% {
      opacity: 0;
      transform: translateY(-50px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes fadeInContent {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .page-content {
    animation: slideDownMajor 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
  }
`;

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const { products, loading } = useProducts();
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el preloader en esta sesión
    const preloaderShown = sessionStorage.getItem('preloaderShown');

    if (!preloaderShown) {
      // Primera vez: mostrar preloader
      setShowPreloader(true);
      // Marcar que ya se mostró
      sessionStorage.setItem('preloaderShown', 'true');

      // Ocultar después de 3.2 segundos
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 3200);

      return () => clearTimeout(timer);
    }
    // Si ya se mostró, no mostrar el preloader
  }, []);

  return (
    <>
      <style>{pageStyles}</style>
      {showPreloader && <Preloader duration={3200} onComplete={() => setShowPreloader(false)} />}
      <div className={showPreloader ? 'opacity-0' : 'page-content'}>
        <HeroSection />

        {/* Carrusel de productos destacados */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Productos destacados</h2>
            {loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay productos disponibles</div>
            ) : (
              <>
                <Carousel opts={{ align: 'start' }} setApi={setCarouselApi}>
                  <CarouselContent>
                    {products.slice(0, 10).map((product) => (
                      <CarouselItem key={product._id || product.id} className="md:basis-1/3 lg:basis-1/4">
                        <ProductCard product={product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                {/* Autoplay effect */}
                {carouselApi && <AutoPlayCarousel api={carouselApi} delay={2000} />}
              </>
            )}
          </div>
        </section>
        <BenefitsSection />
        <HowItWorksSection />
        <CtaSection />
      </div>
    </>
  );

  // Componente para autoplay del carrusel
  function AutoPlayCarousel({ api, delay = 3000 }: { api: CarouselApi; delay?: number }) {
    useEffect(() => {
      if (!api) return;
      const interval = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, delay);
      return () => clearInterval(interval);
    }, [api, delay]);
    return null;
  }
}
