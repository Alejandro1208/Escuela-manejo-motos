import React from 'react';
import { useSite } from '../../hooks/useSite';

const AboutSection: React.FC = () => {
  const { aboutSection } = useSite();

  if (!aboutSection) {
    return (
      <section id="quienes-somos" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4"><div className="animate-pulse">Cargando...</div></div>
      </section>
    );
  }
  
  const paragraphs = aboutSection.content.split('\n').filter(p => p.trim() !== '');

  return (
    <section id="quienes-somos" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              {aboutSection.title}
            </h2>
            {paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <div className="relative h-80 md:h-full rounded-lg overflow-hidden shadow-2xl">
            <img 
              src={aboutSection.image_url} 
              alt="Equipo de la escuela de manejo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;