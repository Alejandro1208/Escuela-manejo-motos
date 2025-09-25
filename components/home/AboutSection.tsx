import React from 'react';

const AboutSection: React.FC = () => {
  return (
    // Se añade el color de fondo para el modo oscuro
    <section id="quienes-somos" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Se añaden colores de texto para el modo oscuro */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Quiénes Somos</h2>
            <p>
              Un equipo en constante crecimiento, con el objetivo muy claro de fortalecer la convivencia y seguridad en la vía pública. Somos una Academia habilitada Por El Gobierno De la Ciudad de Bs As.
            </p>
            <p>
              Nuestro trabajo está orientado hacia quienes desean conducir una motocicleta con consciencia y de forma segura. Trabajamos con particulares y tenemos servicios orientados para empresas.
            </p>
            <p>
              Que la buena formación sea el camino para que puedas tener una independencia a la hora de moverte y que esa movilidad la puedas disfrutar sin lamentar incidentes.
            </p>
          </div>
          <div className="relative h-80 md:h-full rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/about/800/600" 
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