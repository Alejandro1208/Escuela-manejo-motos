import React from 'react';
import { useSite } from '../../hooks/useSite'; // Importar useSite
import type { Course } from '../../types';
import { WhatsAppIcon } from '../Icons';
import Carousel from '../common/Carousel';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { siteIdentity } = useSite(); // Obtener la identidad del sitio para el fallback

  // Lógica para el enlace de WhatsApp
  const generalWhatsappNumber = siteIdentity?.contactPhone?.replace(/[^0-9]/g, '') || '';
  const generalWhatsappLink = `https://wa.me/${generalWhatsappNumber}`;
  
  // Si el curso tiene su propio link, úsalo. Si no, usa el link general del sitio.
  const finalWhatsappLink = course.whatsappLink || generalWhatsappLink;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2">
      <div className="h-56">
        <Carousel images={course.images} autoPlay={false} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4">{course.description}</p>
        <a
          href={finalWhatsappLink} // <-- Se usa el enlace dinámico
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 mr-2" />
          Más info
        </a>
      </div>
    </div>
  );
};

export default CourseCard;