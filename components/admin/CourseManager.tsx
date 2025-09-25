import React, { useState, useMemo } from 'react';
import { useSite } from '../../hooks/useSite';
import type { Course } from '../../types';
import { TrashIcon } from '../Icons';

type ImageInput = {
    key: number;
    url: string | null;
    file: File | null;
};

const CourseManager: React.FC = () => {
    const { courses, categories, addCourse, updateCourse, deleteCourse, isLoading } = useSite();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Partial<Course>>({}); // Se cambió para incluir whatsappLink
    const [imageInputs, setImageInputs] = useState<ImageInput[]>([]);

    const categoryMap = useMemo(() => {
        if (!categories) return new Map();
        return new Map(categories.map(cat => [cat.id, cat.title]));
    }, [categories]);

    if (isLoading || !courses || !categories) {
        return <div>Cargando...</div>;
    }

    const openModal = (course: Course | null = null) => {
        if (course) {
            setEditingCourse({ ...course });
            const initialImages = course.images.map((url, i) => ({ key: i, url, file: null }));
            while (initialImages.length < 5) initialImages.push({ key: Date.now() + initialImages.length, url: null, file: null });
            setImageInputs(initialImages);
        } else {
            setEditingCourse({ title: '', description: '', categoryId: categories[0]?.id || 0, whatsappLink: '', images: [] });
            setImageInputs(Array.from({ length: 5 }, (_, i) => ({ key: i, url: null, file: null })));
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse({});
        setImageInputs([]);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourse) return;

        const formData = new FormData();
        
        if (editingCourse.id) {
            formData.append('id', String(editingCourse.id));
        }
        formData.append('title', editingCourse.title || '');
        formData.append('description', editingCourse.description || '');
        formData.append('categoryId', String(editingCourse.categoryId || 0));
        // --- LÍNEA AÑADIDA ---
        // Aquí nos aseguramos de enviar el enlace de WhatsApp al backend.
        formData.append('whatsappLink', editingCourse.whatsappLink || '');

        const existingImagesToKeep: string[] = [];
        imageInputs.forEach(input => {
            if (input.file) {
                formData.append('images[]', input.file);
            }
            else if (input.url) {
                existingImagesToKeep.push(input.url);
            }
        });
        
        if (editingCourse.id) {
            formData.append('existingImages', existingImagesToKeep.join(','));
        }

        const success = editingCourse.id
            ? await updateCourse(formData)
            : await addCourse(formData);

        if (success) {
            closeModal();
        } else {
            alert('Error al guardar el curso.');
        }
    };
    
    const handleDelete = async (courseId: number) => {
        if (window.confirm('¿Seguro que quieres eliminar este curso?')) {
            await deleteCourse(courseId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingCourse(prev => ({ ...prev, [name]: name === 'categoryId' ? parseInt(value) : value }));
    };

    const handleImageChange = (key: number, file: File | null) => {
        setImageInputs(prev => prev.map(input => (input.key === key ? { ...input, file, url: null } : input)));
    };

    const handleImageDelete = (key: number) => {
        setImageInputs(prev => prev.map(input => 
            input.key === key ? { ...input, file: null, url: null } : input
        ));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestionar Cursos</h2>
                <button onClick={() => openModal()} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Agregar Curso
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-2 px-4">Título</th>
                            <th className="text-left py-2 px-4">Categoría</th>
                            <th className="text-left py-2 px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} className="border-b">
                                <td className="py-2 px-4">{course.title}</td>
                                <td className="py-2 px-4">{categoryMap.get(course.categoryId) || 'N/A'}</td>
                                <td className="py-2 px-4">
                                    <button onClick={() => openModal(course)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                                    <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingCourse && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{editingCourse.id ? 'Editar' : 'Agregar'} Curso</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input type="text" name="title" value={editingCourse.title || ''} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea name="description" value={editingCourse.description || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Enlace de WhatsApp del Curso (Opcional)</label>
                                <input 
                                    type="text" 
                                    name="whatsappLink" 
                                    value={editingCourse.whatsappLink || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="https://wa.me/54911..." 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select name="categoryId" value={editingCourse.categoryId || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-2">Imágenes del Carrusel</h4>
                                <div className="space-y-3">
                                    {imageInputs.map(({ key, url, file }) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <div className="flex-grow">
                                                {url && !file && <img src={url} alt="Imagen actual" className="w-24 h-auto mb-1 rounded"/>}
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={(e) => handleImageChange(key, e.target.files ? e.target.files[0] : null)}
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                            {(url || file) && (
                                                <button type="button" onClick={() => handleImageDelete(key)} className="p-2 text-red-500 rounded-full hover:bg-red-100">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManager;