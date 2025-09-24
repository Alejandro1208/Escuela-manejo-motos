import React, { useState, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';
import type { SocialLink } from '../../types';

const SocialLinksManager: React.FC = () => {
    const { socialLinks, updateSocialLink, siteIdentity } = useSite();
    const [localLinks, setLocalLinks] = useState<SocialLink[]>([]);
    
    useEffect(() => {
        if (socialLinks) {
            setLocalLinks(socialLinks);
        }
    }, [socialLinks]);

    const handleUrlChange = (id: string, url: string) => {
        setLocalLinks(prevLinks => 
            prevLinks.map(link => link.id === id ? { ...link, url } : link)
        );
    };

    const handleSaveChanges = async () => {
        for (const link of localLinks) {
            await updateSocialLink(link);
        }
        alert('Redes sociales actualizadas!');
    };

    if (!socialLinks) {
        return <div>Cargando redes sociales...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-6 mt-8">
            <h2 className="text-2xl font-bold">Redes Sociales</h2>
            <div className="space-y-4">
                {localLinks.map(link => (
                    <div key={link.id}>
                        <label className="block text-sm font-medium text-gray-700">
                            URL de {link.name}
                        </label>
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUrlChange(link.id, e.target.value)}
                            placeholder="Dejar vacío para ocultar el ícono"
                            className="mt-1 block w-full border p-2 rounded-md"
                        />
                    </div>
                ))}
            </div>
            <div>
                <button 
                    onClick={handleSaveChanges} 
                    className="py-2 px-6 text-white rounded-md transition-colors"
                    style={{ backgroundColor: siteIdentity?.primaryColor }}
                >
                    Guardar Cambios en Redes
                </button>
            </div>
        </div>
    );
};

export default SocialLinksManager;