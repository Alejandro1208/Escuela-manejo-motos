
import React from 'react';
import { useSite } from '../hooks/useSite';
import { WhatsAppIcon } from './Icons';

const FloatingButtons: React.FC = () => {
  const { socialLinks } = useSite();

  return (
    <>
      {/* Social Media Bar */}
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex flex-col items-center space-y-2">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 ease-in-out transform -translate-x-1/3 hover:translate-x-0 rounded-l-lg"
            style={{ backgroundColor: social.color }}
            aria-label={social.name}
          >
            <social.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
      
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5491112345678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </>
  );
};

export default FloatingButtons;
