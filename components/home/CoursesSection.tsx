import React from 'react';
import { useSite } from '../../hooks/useSite';
import CourseCard from './CourseCard';

const CoursesSection: React.FC = () => {
    const { courses, categories, isLoading } = useSite();

    // Mostrar un estado de carga mientras se obtienen los datos
    if (isLoading) {
        return (
            <section id="cursos" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold">Cargando Cursos...</h2>
                </div>
            </section>
        );
    }

    // Manejar el caso en que no haya categorías
    if (!categories || categories.length === 0) {
        return (
            <section id="cursos" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p>No hay categorías de cursos para mostrar en este momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="cursos" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nuestros Cursos</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Programas diseñados para cada nivel de experiencia, desde principiantes hasta avanzados.
                    </p>
                </div>

                {categories.map((category) => (
                    <div key={category.id} className="mb-16">
                        <div className="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-2xl font-bold text-gray-800">{category.title}</h3>
                            <div className="mt-3">
                                <p className="font-semibold text-gray-700">Requisitos para Iniciar:</p>
                                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                    {category.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Filtramos y mostramos los cursos de esta categoría */}
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