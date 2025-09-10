
import type { SiteIdentity, SocialLink, User, Category, Course } from '../types';
import { UserRole } from '../types';
import { InstagramIcon, TikTokIcon, YoutubeIcon } from '../components/Icons';

export const initialSiteIdentity: SiteIdentity = {
  logo: 'https://picsum.photos/seed/logo/200/50',
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#10b981', // emerald-500
};

export const initialSocialLinks: SocialLink[] = [
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: InstagramIcon, color: '#E1306C' },
  { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com', icon: TikTokIcon, color: '#000000' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: YoutubeIcon, color: '#FF0000' },
];

export const initialUsers: User[] = [
  { id: 1, username: 'admin', role: UserRole.ADMIN },
  { id: 2, username: 'editor', role: UserRole.EDITOR },
];

export const initialCategories: Category[] = [
  {
    id: 1,
    title: 'Categoría hasta 150cc',
    requirements: ['Edad: a partir de 17 años', 'Manejar actualmente bicicleta'],
  },
  {
    id: 2,
    title: 'Categoría hasta 300cc',
    requirements: ['Licencia A1.2 con 2 años de antigüedad', 'Experiencia comprobable'],
  },
];

export const initialCourses: Course[] = [
  {
    id: 1,
    categoryId: 1,
    title: 'Curso Básico de Manejo',
    description: 'Aprende desde cero los fundamentos de la conducción segura en motos de baja cilindrada.',
    images: ['https://picsum.photos/seed/moto1/800/600', 'https://picsum.photos/seed/moto2/800/600', 'https://picsum.photos/seed/moto3/800/600'],
  },
  {
    id: 2,
    categoryId: 1,
    title: 'Curso de Perfeccionamiento Urbano',
    description: 'Mejora tus habilidades de manejo en el tráfico de la ciudad y aprende técnicas defensivas.',
    images: ['https://picsum.photos/seed/moto4/800/600', 'https://picsum.photos/seed/moto5/800/600'],
  },
  {
    id: 3,
    categoryId: 2,
    title: 'Curso Avanzado de Ruta',
    description: 'Domina las curvas y las altas velocidades con nuestro curso para motos de hasta 300cc.',
    images: ['https://picsum.photos/seed/moto6/800/600', 'https://picsum.photos/seed/moto7/800/600', 'https://picsum.photos/seed/moto8/800/600'],
  },
   {
    id: 4,
    categoryId: 2,
    title: 'Técnicas de Frenado y Evasión',
    description: 'Aprende a reaccionar ante imprevistos y a controlar tu moto en situaciones de emergencia.',
    images: ['https://picsum.photos/seed/moto9/800/600', 'https://picsum.photos/seed/moto10/800/600'],
  },
];
