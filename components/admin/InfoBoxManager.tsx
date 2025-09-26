import React, { useState, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';
import { InfoBoxData } from '../../types';

const InfoBoxManager: React.FC = () => {
    const { infoBoxes, updateInfoBoxes } = useSite();
    const [formData, setFormData] = useState<Partial<InfoBoxData>>({});

    useEffect(() => {
        if (infoBoxes) {
            setFormData(infoBoxes);
        }
    }, [infoBoxes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateInfoBoxes(formData as InfoBoxData);
        if (success) {
            alert('Información actualizada!');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Gestionar Cajas de Información de Cursos</h2>
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Columna 1 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Título Columna 1</label>
                        <input type="text" name="title1" value={formData.title1 || ''} onChange={handleInputChange} className="w-full border p-2 rounded"/>
                        <label className="block text-sm font-medium">Contenido Columna 1</label>
                        <textarea name="content1" value={formData.content1 || ''} onChange={handleInputChange} className="w-full border p-2 rounded" rows={4}></textarea>
                    </div>
                    {/* Columna 2 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Título Columna 2</label>
                        <input type="text" name="title2" value={formData.title2 || ''} onChange={handleInputChange} className="w-full border p-2 rounded"/>
                        <label className="block text-sm font-medium">Contenido Columna 2</label>
                        <textarea name="content2" value={formData.content2 || ''} onChange={handleInputChange} className="w-full border p-2 rounded" rows={4}></textarea>
                    </div>
                    {/* Columna 3 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Título Columna 3</label>
                        <input type="text" name="title3" value={formData.title3 || ''} onChange={handleInputChange} className="w-full border p-2 rounded"/>
                        <label className="block text-sm font-medium">Contenido Columna 3</label>
                        <textarea name="content3" value={formData.content3 || ''} onChange={handleInputChange} className="w-full border p-2 rounded" rows={4}></textarea>
                    </div>
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

export default InfoBoxManager;