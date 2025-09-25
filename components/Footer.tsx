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
  const navLinks = [
      { name: 'Inicio', targetId: 'inicio' },
      { name: 'Servicios', targetId: 'cursos' },
      { name: 'Quiénes Somos?', targetId: 'quienes-somos' },
      { name: 'Contáctenos', targetId: 'contacto' },
  ];

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  
  // --- FUNCIÓN PARA EL SCROLL SUAVE ---
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
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
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map(link => (
                <li key={link.name}>
                  {/* --- ENLACES ACTUALIZADOS CON onClick --- */}
                  <a 
                    href={`#${link.targetId}`}
                    onClick={(e) => handleScroll(e, link.targetId)}
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contacto</h3>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li>{siteIdentity?.contactPhone}</li>
              <li>{siteIdentity?.contactAddress}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Síguenos</h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks && socialLinks
                .filter(social => social.url && iconMap[social.icon])
                .map(social => {
                    const IconComponent = iconMap[social.icon];
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