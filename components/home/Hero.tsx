import React, { useState, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';

const Hero: React.FC = () => {
  const { siteIdentity, heroSlides } = useSite();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroSlides && heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!heroSlides || heroSlides.length === 0) {
    return <section id="inicio" className="relative h-screen bg-gray-300 animate-pulse"></section>;
  }

  const currentSlide = heroSlides[currentIndex];

  return (
    <section id="inicio" className="relative h-screen text-white overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${slide.image_url})`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
      
      {/* --- AJUSTE 1: Se cambió la opacidad de /50 a /30 --- */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 key={`title-${currentSlide.id}`} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-down">
          {currentSlide.title}
        </h1>
        <p key={`subtitle-${currentSlide.id}`} className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up">
          {currentSlide.subtitle}
        </p>
        
        {/* --- AJUSTE 2: Se cambió el <a> para que use la función de scroll --- */}
        <a
          href="#cursos"
          onClick={handleScrollTo}
          className="px-8 py-3 text-lg font-semibold rounded-lg text-white transition-all duration-300 shadow-lg transform hover:scale-105"
          style={{ backgroundColor: siteIdentity?.primaryColor }}
        >
          Más Información
        </a>
      </div>
    </section>
  );
};

export default Hero;