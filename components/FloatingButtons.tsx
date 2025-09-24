import React from 'react';
import { useSite } from '../hooks/useSite';
import { WhatsAppIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from './Icons';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
};

const FloatingButtons: React.FC = () => {
  const { socialLinks, siteIdentity } = useSite();

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  
  const whatsappNumber = siteIdentity?.contact_phone?.replace(/[^0-9]/g, '') || '';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex flex-col items-center space-y-2">
        {socialLinks && socialLinks
            .filter(social => social.url && iconMap[social.icon]) 
            .map((social) => {
                const IconComponent = iconMap[social.icon];
                if (!IconComponent) return null;

                return (
                    <a
                        key={social.id}
                        href={formatUrl(social.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 ease-in-out transform -translate-x-1/3 hover:translate-x-0 rounded-l-lg"
                        style={{ backgroundColor: social.color }}
                        aria-label={social.name}
                    >
                        <IconComponent className="w-6 h-6" />
                    </a>
                );
            })}
      </div>
      {whatsappNumber && (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
            aria-label="Contactar por WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </a>
      )}
    </>
  );
};

export default FloatingButtons;