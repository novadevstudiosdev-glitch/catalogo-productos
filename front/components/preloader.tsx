'use client';

import { useEffect, useState } from 'react';

const preloaderStyles = `
  @keyframes fadeOut {
    0% {
      opacity: 1;
      visibility: visible;
    }
    85% {
      opacity: 0.2;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-40px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  @keyframes rotateLine {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes expandFade {
    0% {
      opacity: 0;
      filter: blur(10px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      filter: blur(20px);
    }
  }

  .preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeOut 3.2s ease-in-out forwards;
  }

  .preloader-content {
    text-align: center;
    animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 10;
  }

  .preloader-logo {
    font-size: 72px;
    font-weight: bold;
    letter-spacing: 4px;
    margin-bottom: 32px;
    background: linear-gradient(135deg, #986459 0%, #987977 50%, #7D6470 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-shadow: 0 0 20px rgba(152, 100, 89, 0.3);
  }

  .preloader-spinner-container {
    width: 100px;
    height: 100px;
    margin: 0 auto 32px;
    position: relative;
    animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preloader-spinner {
    width: 100%;
    height: 100%;
    position: relative;
    border: 4px solid transparent;
    border-top-color: #986459;
    border-right-color: #987977;
    border-bottom-color: #7D6470;
    border-radius: 50%;
    animation: rotateLine 2s linear infinite;
    box-shadow: 0 0 20px rgba(152, 100, 89, 0.4);
  }

  .preloader-spinner::before {
    display: none;
  }

  .preloader-spinner::after {
    display: none;
  }

  .preloader-text {
    font-size: 14px;
    color: #999;
    letter-spacing: 4px;
    text-transform: uppercase;
    animation: pulse 2.5s ease-in-out infinite;
    font-weight: 500;
  }

  .preloader-glow {
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(152, 100, 89, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: expandFade 2s ease-out infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .page-content {
    animation: slideDown 0.8s ease-out;
  }
`;

interface PreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

export function Preloader({ onComplete, duration = 2500 }: PreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <>
      <style>{preloaderStyles}</style>
      {showPreloader && (
        <div className="preloader">
          <div className="preloader-glow"></div>
          <div className="preloader-content">
            <div className="preloader-logo">MOK</div>
            <div className="preloader-spinner-container">
              <div className="preloader-spinner"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
