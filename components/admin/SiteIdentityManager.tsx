import React, { useState, useRef, useEffect } from 'react';
import { useSite } from '../../hooks/useSite';
import type { SiteIdentity, SocialLink } from '../../types';

const SiteIdentityManager: React.FC = () => {
  const { siteIdentity, socialLinks, updateSiteIdentity, updateSocialLink } = useSite();
  
  const [localIdentity, setLocalIdentity] = useState<Partial<SiteIdentity>>({});
  const [localLinks, setLocalLinks] = useState<SocialLink[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (siteIdentity) {
      setLocalIdentity(siteIdentity);
      setLogoPreview(siteIdentity.logo);
    }
    if (socialLinks) {
      setLocalLinks(socialLinks);
    }
  }, [siteIdentity, socialLinks]);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalIdentity({ ...localIdentity, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (id: string, url: string) => {
    setLocalLinks(prev => prev.map(link => link.id === id ? { ...link, url } : link));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    // Añade todos los campos de texto usando los nombres camelCase
    Object.entries(localIdentity).forEach(([key, value]) => {
        formData.append(key, value as string);
    });

    if (logoFile) {
      formData.append('logo', logoFile);
    }
    // Envía la URL actual del logo para que el backend sepa si no se cambió
    formData.append('logo_url', siteIdentity?.logo || '');
    
    const socialPromises = localLinks.map(link => updateSocialLink(link));

    try {
      await Promise.all([updateSiteIdentity(formData), ...socialPromises]);
      alert('Cambios guardados con éxito!');
    } catch (error) {
      alert('Error al guardar los cambios.');
    }
  };

  if (!siteIdentity || !socialLinks) return <div>Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      {/* --- SECCIÓN MARCA --- */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-bold">Marca del Sitio</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="flex items-center space-x-4 mt-1">
            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-contain border p-1 rounded-md" />}
            <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*"/>
            <button onClick={() => fileInputRef.current?.click()} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm">
              Cambiar Logo
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Sitio (para el Header)</label>
          <input type="text" name="siteName" value={localIdentity.siteName || ''} onChange={handleIdentityChange} className="mt-1 block w-full md:w-1/2 border p-2 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Colores Principales</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            <div className="flex items-center space-x-3">
              <label htmlFor="primaryColor" className="text-sm">Color Primario:</label>
              <input type="color" id="primaryColor" name="primaryColor" value={localIdentity.primaryColor || '#000000'} onChange={handleIdentityChange} className="w-10 h-10 rounded-full"/>
              <span>{localIdentity.primaryColor}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- SECCIÓN CONTACTO Y FOOTER --- */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-bold">Información de Contacto y Footer</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
          <input type="text" name="contactPhone" value={localIdentity.contactPhone || ''} onChange={handleIdentityChange} className="mt-1 block w-full md:w-1/2 border p-2 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" name="contactAddress" value={localIdentity.contactAddress || ''} onChange={handleIdentityChange} className="mt-1 block w-full border p-2 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email para Formulario de Contacto</label>
          <input type="email" name="contactEmail" value={localIdentity.contactEmail || ''} onChange={handleIdentityChange} className="mt-1 block w-full md:w-1/2 border p-2 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Texto del Footer</label>
          <input type="text" name="footerText" value={localIdentity.footerText || ''} onChange={handleIdentityChange} className="mt-1 block w-full border p-2 rounded-md"/>
        </div>
      </div>

      {/* --- SECCIÓN REDES SOCIALES --- */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-bold">Redes Sociales</h3>
        {localLinks.map(link => (
          <div key={link.id}>
            <label className="block text-sm font-medium text-gray-700">URL de {link.name}</label>
            <input type="text" value={link.url || ''} onChange={(e) => handleLinkChange(link.id, e.target.value)} placeholder="Dejar vacío para ocultar" className="mt-1 block w-full border p-2 rounded-md"/>
          </div>
        ))}
      </div>

      {/* --- SECCIÓN MAPA --- */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Mapa de Google</h3>
        <label className="block text-sm font-medium text-gray-700">Código `iframe` de Google Maps</label>
        <textarea name="mapIframe" value={localIdentity.mapIframe || ''} onChange={handleIdentityChange} rows={4} className="mt-1 block w-full border p-2 rounded-md font-mono text-sm"></textarea>
        <details className="text-sm text-gray-600">
          <summary>¿Cómo obtener el código del mapa?</summary>
          <ol className="list-decimal list-inside mt-2 space-y-1 p-4 bg-gray-50 rounded">
            <li>Abre Google Maps y busca tu dirección.</li>
            <li>Haz clic en el botón "Compartir".</li>
            <li>En la ventana que aparece, selecciona la pestaña "Insertar un mapa".</li>
            <li>Haz clic en "COPIAR HTML".</li>
            <li>Pega todo el código que copiaste en el campo de arriba.</li>
          </ol>
        </details>
      </div>

      {/* --- BOTÓN ÚNICO DE GUARDAR --- */}
      <div className="pt-6 border-t">
        <button onClick={handleSaveChanges} className="py-2 px-8 text-lg font-semibold text-white rounded-md transition-colors w-full md:w-auto hover:opacity-90 shadow-lg" style={{ backgroundColor: siteIdentity.primaryColor }}>
          Guardar Todos los Cambios
        </button>
      </div>
    </div>
  );
};

export default SiteIdentityManager;