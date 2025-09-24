
import React, { useState } from 'react';
import { useSite } from '../hooks/useSite';
import { MenuIcon, CloseIcon, UserIcon } from './Icons';


const Header: React.FC = () => {
  const { siteIdentity, auth } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#cursos' },
    { name: 'Quiénes Somos?', href: '#quienes-somos' },
    { name: 'Contáctenos', href: '#contacto' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#inicio" className="flex items-center space-x-2">
              {siteIdentity && <img className="h-12 w-auto object-contain" src={siteIdentity.logo} alt="Logo" />}
              <span className="font-bold text-gray-800 text-lg hidden sm:block">{siteIdentity?.site_name}</span>
            </a>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ '--hover-color': siteIdentity.primaryColor } as React.CSSProperties}
                  onMouseOver={(e) => e.currentTarget.style.color = siteIdentity.primaryColor}
                  onMouseOut={(e) => e.currentTarget.style.color = ''}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            {auth.isAuthenticated && (
              <a href="/#/admin" className="hidden md:block bg-gray-200 text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors mr-4">
                <UserIcon className="h-5 w-5" />
              </a>
            )}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="text-gray-600 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            {auth.isAuthenticated && (
              <a href="/#/admin" onClick={handleLinkClick} className="text-gray-600 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Panel Admin
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
