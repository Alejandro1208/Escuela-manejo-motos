import React from 'react';
import type { Course } from '../../types';
import { WhatsAppIcon } from '../Icons';
import Carousel from '../common/Carousel';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    // Se añade el color de fondo para el modo oscuro
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2">
      <div className="h-56">
        <Carousel images={course.images} autoPlay={false} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* Se añaden colores de texto para el modo oscuro */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4">{course.description}</p>
        <a
          href="https://wa.me/5491112345678" // Este número debería ser dinámico del context más adelante
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