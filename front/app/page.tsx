'use client';

import { useState, useEffect } from 'react';
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
        <BenefitsSection />
        <HowItWorksSection />
        <CtaSection />
      </div>
    </>
  );
}
