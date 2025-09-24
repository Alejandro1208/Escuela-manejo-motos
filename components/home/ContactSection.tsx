import React, { useState } from 'react';
import { useSite } from '../../hooks/useSite';
import DOMPurify from 'dompurify';

const ContactSection: React.FC = () => {
  const { siteIdentity } = useSite();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Enviando...');

    try {
        const response = await fetch('https://alejandrosabater.com.ar/api/contact.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            setFormStatus('¡Mensaje enviado con éxito!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setFormStatus(`Error: ${result.message || 'No se pudo enviar el mensaje.'}`);
        }
    } catch (error) {
        setFormStatus('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
        setTimeout(() => setFormStatus(''), 5000);
    }
  };
  
  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Contacto</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            ¿Tienes alguna pregunta? No dudes en contactarnos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h3>
              <p className="text-gray-600"><strong>Teléfono:</strong> {siteIdentity?.contactPhone}</p>
              <p className="text-gray-600"><strong>Ubicación:</strong> {siteIdentity?.contactAddress}</p>
            </div>
            <div className="rounded-lg shadow-md overflow-hidden h-80"
                 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(siteIdentity?.mapIframe || '') }}
            >
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
                <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: siteIdentity?.primaryColor }} 
                >
                  Enviar Mensaje
                </button>
              </div>
              {formStatus && <p className="text-center text-gray-600 mt-4">{formStatus}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;