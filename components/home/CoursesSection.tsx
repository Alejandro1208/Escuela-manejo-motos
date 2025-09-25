import React from 'react';
import { useSite } from '../../hooks/useSite';
import CourseCard from './CourseCard';

const CoursesSection: React.FC = () => {
    const { courses, categories, isLoading, siteIdentity } = useSite();

    // Estado de carga con modo oscuro
    if (isLoading) {
        return (
            <section id="cursos" className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cargando Cursos...</h2>
                </div>
            </section>
        );
    }

    // Estado de categorías vacías con modo oscuro
    if (!categories || categories.length === 0) {
        return (
            <section id="cursos" className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No hay categorías de cursos para mostrar en este momento.</p>
                </div>
            </section>
        );
    }

    return (
        // Fondo de la sección
        <section id="cursos" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    {/* Títulos de la sección */}
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Nuestros Cursos</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Programas diseñados para cada nivel de experiencia, desde principiantes hasta avanzados.
                    </p>
                </div>

                {categories.map((category) => (
                    <div key={category.id} className="mb-16">
                        {/* Tarjeta de la categoría */}
                        <div 
                            className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border-l-4" 
                            style={{ borderColor: siteIdentity?.primaryColor }}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{category.title}</h3>
                            <div className="mt-3">
                                <p className="font-semibold text-gray-700 dark:text-gray-300">Requisitos para Iniciar:</p>
                                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
                                    {category.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses && courses
                                .filter((course) => course.categoryId == category.id)
                                .map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CoursesSection;