import React, { useState } from 'react';
import { useSite } from '../../hooks/useSite';
import type { Category } from '../../types';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useSite();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

    if (!categories) {
        return <div>Cargando categorías...</div>;
    }

    const openModal = (category: Partial<Category> | null = null) => {
        setEditingCategory(category ? { ...category } : { title: '', requirements: [] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        const categoryToSave = {
            ...editingCategory,
            requirements: Array.isArray(editingCategory.requirements)
                ? editingCategory.requirements
                : (editingCategory.requirements as string).split(',').map(req => req.trim())
        };

        let success = false;
        if (categoryToSave.id) {
            success = await updateCategory(categoryToSave as Category);
        } else {
            success = await addCategory(categoryToSave as Omit<Category, 'id'>);
        }

        if (success) {
            closeModal();
        } else {
            alert(`Error al guardar la categoría.`);
        }
    };
    
    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            const success = await deleteCategory(id);
            if (!success) {
                alert('Error al eliminar la categoría.');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingCategory) return;
        const { name, value } = e.target;
        setEditingCategory({ ...editingCategory, [name]: value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestionar Categorías</h2>
                <button onClick={() => openModal()} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Agregar Categoría
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-2 px-4">Título</th>
                            <th className="text-left py-2 px-4">Requisitos</th>
                            <th className="text-left py-2 px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-b">
                                <td className="py-2 px-4">{cat.title}</td>
                                <td className="py-2 px-4">{cat.requirements.join(', ')}</td>
                                <td className="py-2 px-4">
                                    <button onClick={() => openModal(cat)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingCategory.id ? 'Editar' : 'Agregar'} Categoría</h3>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input type="text" name="title" value={editingCategory.title} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Requisitos (separados por coma)</label>
                                <textarea name="requirements" value={Array.isArray(editingCategory.requirements) ? editingCategory.requirements.join(', ') : editingCategory.requirements} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3}></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
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

export default CategoryManager;