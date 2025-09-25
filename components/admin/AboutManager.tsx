import React, { useState, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';
import { AboutSectionData } from '../../types';

const AboutManager: React.FC = () => {
    const { aboutSection, updateAboutSection } = useSite();
    const [formData, setFormData] = useState<Partial<AboutSectionData>>({});
    const [newImage, setNewImage] = useState<File | null>(null);

    useEffect(() => {
        if (aboutSection) {
            setFormData(aboutSection);
        }
    }, [aboutSection]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formPayload = new FormData();
        formPayload.append('title', formData.title || '');
        formPayload.append('content', formData.content || '');
        if (newImage) {
            formPayload.append('image', newImage);
        } else if (formData.image_url) {
            formPayload.append('existingImage', formData.image_url);
        }

        const success = await updateAboutSection(formPayload);
        if (success) {
            alert('Sección "Quiénes Somos" actualizada!');
            setNewImage(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Gestionar "Quiénes Somos"</h2>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Contenido</label>
                    <textarea name="content" value={formData.content || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={8}></textarea>
                    <p className="text-xs text-gray-500 mt-1">Usa saltos de línea (Enter) para separar los párrafos.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium">Imagen</label>
                    {formData.image_url && !newImage && <img src={formData.image_url} className="w-48 h-auto my-2 rounded"/>}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewImage(e.target.files[0])} className="mt-1"/>
                </div>
                <div>
                    <button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutManager;