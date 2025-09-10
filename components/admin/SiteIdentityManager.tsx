import React, { useState, useRef, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';
import type { SiteIdentity } from '../../types';

const SiteIdentityManager: React.FC = () => {
  const { siteIdentity, updateSiteIdentity } = useSite();
  const [localIdentity, setLocalIdentity] = useState<SiteIdentity>(siteIdentity);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalIdentity(siteIdentity);
  }, [siteIdentity]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIdentity({ ...localIdentity, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Actualiza solo el estado local para la vista previa
          setLocalIdentity({ ...localIdentity, logo: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    const success = updateSiteIdentity(localIdentity);
    if (success) {
      alert('Cambios guardados!');
    } else {
      alert('Error al guardar los cambios.');
    }
  };

  if (!localIdentity.logo) {
    return null; // or a loading spinner
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Identidad del Sitio</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Logo</h3>
          <div className="flex items-center space-x-4">
            <img src={localIdentity.logo} alt="Current Logo" className="h-12 w-auto border p-1 rounded-md" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
            >
              Cambiar Logo
            </button>
          </div>
           <p className="text-xs text-gray-500 mt-2">Nota: El cambio de logo es solo una vista previa y no se guardará en el servidor con esta funcionalidad básica.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Colores Principales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="primaryColor" className="text-sm font-medium">Color Primario:</label>
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                value={localIdentity.primaryColor}
                onChange={handleColorChange}
                className="w-10 h-10 rounded-full"
              />
              <span>{localIdentity.primaryColor}</span>
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="secondaryColor" className="text-sm font-medium">Color Secundario:</label>
              <input
                type="color"
                id="secondaryColor"
                name="secondaryColor"
                value={localIdentity.secondaryColor}
                onChange={handleColorChange}
                 className="w-10 h-10 rounded-full"
              />
               <span>{localIdentity.secondaryColor}</span>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={handleSaveChanges}
            className="py-2 px-6 text-white rounded-md transition-colors"
            style={{ backgroundColor: siteIdentity.primaryColor }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteIdentityManager;
