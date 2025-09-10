
import React from 'react';
import { useSite } from '../../hooks/useSite';
import Carousel from '../common/Carousel';

const Hero: React.FC = () => {
  const { siteIdentity } = useSite();

  const heroImages = [
    'https://picsum.photos/seed/hero1/1920/1080',
    'https://picsum.photos/seed/hero2/1920/1080',
    'https://picsum.photos/seed/hero3/1920/1080',
  ];

  return (
    <section id="inicio" className="relative h-screen text-white">
      <div className="absolute inset-0">
        <Carousel images={heroImages} />
      </div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-in-down">
          Conduce tu Futuro, con Seguridad y Confianza
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up">
          En nuestra academia, no solo aprendes a manejar, te conviertes en un motociclista responsable.
        </p>
        <a
          href="#cursos"
          className="px-8 py-3 text-lg font-semibold rounded-lg text-white transition-all duration-300 shadow-lg transform hover:scale-105"
          style={{ backgroundColor: siteIdentity.primaryColor }}
        >
          Más Información
        </a>
      </div>
    </section>
  );
};

export default Hero;
