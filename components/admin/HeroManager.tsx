import React, { useState } from 'react';
import { useSite } from '../../hooks/useSite';
import { HeroSlide } from '../../types';

const HeroManager: React.FC = () => {
    const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useSite();
    const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);

    const handleEdit = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setNewImage(null);
    };

    const handleAddNew = () => {
        setEditingSlide({});
        setNewImage(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este slide?')) {
            await deleteHeroSlide(id);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSlide) return;

        const formData = new FormData();
        if (editingSlide.id) {
            formData.append('id', editingSlide.id.toString());
        }
        formData.append('title', editingSlide.title || '');
        formData.append('subtitle', editingSlide.subtitle || '');
        if (newImage) {
            formData.append('image', newImage);
        } else if (editingSlide.image_url) {
            formData.append('existingImage', editingSlide.image_url);
        }

        if (editingSlide.id) {
            await updateHeroSlide(formData);
        } else {
            await addHeroSlide(formData);
        }
        setEditingSlide(null);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingSlide) return;
        setEditingSlide({ ...editingSlide, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestionar Hero Banner</h2>
                <button onClick={handleAddNew} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Añadir Nuevo Slide
                </button>
            </div>
            
            <div className="space-y-4">
                {heroSlides?.map(slide => (
                    <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                            <img src={slide.image_url} alt={slide.title} className="w-24 h-12 object-cover rounded"/>
                            <div>
                                <p className="font-bold">{slide.title}</p>
                                <p className="text-sm text-gray-600">{slide.subtitle}</p>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(slide)} className="text-blue-500 hover:text-blue-700">Editar</button>
                            <button onClick={() => handleDelete(slide.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {editingSlide && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingSlide.id ? 'Editar Slide' : 'Nuevo Slide'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Título</label>
                                <input type="text" name="title" value={editingSlide.title || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Subtítulo</label>
                                <textarea name="subtitle" value={editingSlide.subtitle || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Imagen</label>
                                {editingSlide.image_url && !newImage && <img src={editingSlide.image_url} className="w-32 h-auto my-2"/>}
                                <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewImage(e.target.files[0])} className="mt-1"/>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setEditingSlide(null)} className="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroManager;