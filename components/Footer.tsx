import React from 'react';
import { useSite } from '../hooks/useSite';
import { InstagramIcon, TikTokIcon, YoutubeIcon } from './Icons';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
};

const Footer: React.FC = () => {
  const { siteIdentity, socialLinks } = useSite();
  const navLinks = ['Inicio', 'Servicios', 'Quiénes Somos?', 'Contáctenos'];

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            {siteIdentity && <img className="h-10 w-auto bg-white p-1 rounded" src={siteIdentity.logo} alt="Logo" />}
            <p className="mt-4 text-gray-400 text-sm">
              {siteIdentity?.footerText}
            </p>
          </div>
          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace('?', '').replace(' ', '-')}`} className="text-base text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Columna 3: Contacto (Dinámico) */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contacto</h3>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li>{siteIdentity?.contactPhone}</li>
              <li>{siteIdentity?.contactAddress}</li>
            </ul>
          </div>
          {/* Columna 4: Redes Sociales (Dinámico) */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Síguenos</h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks && socialLinks
                .filter(social => social.url && iconMap[social.icon]) // Filtra si no hay URL o si el ícono no existe
                .map(social => {
                    const IconComponent = iconMap[social.icon]; // Usa el mapa para obtener el componente
                    if (!IconComponent) return null;

                    return (
                        <a key={social.id} href={formatUrl(social.url)} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
                        style={{ '--hover-color': social.color } as React.CSSProperties}
                        onMouseOver={(e) => e.currentTarget.style.color = social.color}
                        onMouseOut={(e) => e.currentTarget.style.color = ''}
                        >
                        <span className="sr-only">{social.name}</span>
                        <IconComponent className="h-6 w-6" />
                        </a>
                    );
                })}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteIdentity?.siteName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;