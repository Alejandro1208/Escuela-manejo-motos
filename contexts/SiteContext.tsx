import React,
{
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import type { SiteIdentity, SocialLink, User, Category, Course, HeroSlide, AboutSectionData, InfoBoxData  } from '../types';

type Theme = 'light' | 'dark';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export interface SiteContextType {
  siteIdentity: SiteIdentity | null;
  socialLinks: SocialLink[] | null;
  users: User[] | null;
  categories: Category[] | null;
  courses: Course[] | null;
  auth: AuthState;
  isLoading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addCourse: (formData: FormData) => Promise<boolean>;
  updateCourse: (formData: FormData) => Promise<boolean>;
  deleteCourse: (courseId: number) => Promise<boolean>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: number) => Promise<boolean>;
  addUser: (user: Omit<User, 'id'> & {
    password?: string
  }) => Promise<boolean>;
  updateUser: (user: User & {
    password?: string
  }) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
  updateSiteIdentity: (formData: FormData) => Promise<boolean>;
  updateSocialLink: (socialLink: {
    id: string,
    url: string
  }) => Promise<boolean>;
  heroSlides: HeroSlide[] | null;
  addHeroSlide: (formData: FormData) => Promise<boolean>;
  updateHeroSlide: (formData: FormData) => Promise<boolean>;
  deleteHeroSlide: (slideId: number) => Promise<boolean>;
  aboutSection: AboutSectionData | null;
  updateAboutSection: (formData: FormData) => Promise<boolean>;
  infoBoxes: InfoBoxData | null;
    updateInfoBoxes: (data: InfoBoxData) => Promise<boolean>;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

const API_URL = 'https://alejandrosabater.com.ar/api';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (storedPrefs === 'light' || storedPrefs === 'dark') {
      return storedPrefs;
    }
  }
  return 'light';
};

export const SiteProvider: React.FC<{
  children: ReactNode
}> = ({
  children
}) => {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[] | null>(null);
    const [siteIdentity, setSiteIdentity] = useState<SiteIdentity | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLink[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [auth, setAuth] = useState<AuthState>({
      isAuthenticated: false,
      user: null
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [aboutSection, setAboutSection] = useState<AboutSectionData | null>(null);
    const [infoBoxes, setInfoBoxes] = useState<InfoBoxData | null>(null);


    useEffect(() => {
      const root = window.document.documentElement;
      const isDark = theme === 'dark';
      root.classList.toggle('dark', isDark);
      localStorage.setItem('theme', theme);
    }, [theme]);

        useEffect(() => {
        // Solo se ejecuta si tenemos la identidad del sitio y tiene un logo
        if (siteIdentity?.logo) {
            // Busca la etiqueta del favicon en el <head> del documento
            let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

            // Si no existe, la crea y la añade al <head>
            if (!faviconLink) {
                faviconLink = document.createElement('link');
                faviconLink.rel = 'icon';
                document.head.appendChild(faviconLink);
            }

            // Actualiza la URL del favicon con la URL del logo
            faviconLink.href = siteIdentity.logo;
        }
    }, [siteIdentity]);

    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API_URL}/site_identity.php`),
          fetch(`${API_URL}/social_links.php`),
          fetch(`${API_URL}/users.php`),
          fetch(`${API_URL}/courses.php`),
          fetch(`${API_URL}/hero.php`), 
          fetch(`${API_URL}/about.php`),
          fetch(`${API_URL}/infoboxes.php`), 
        ]);
        const data = await Promise.all(responses.map(res => res.json()));
        setSiteIdentity(data[0].siteIdentity);
        setSocialLinks(data[1].socialLinks);
        setUsers(data[2].users);
        setCourses(data[3].courses);
        setCategories(data[3].categories);
        setHeroSlides(data[4].heroSlides);
        setAboutSection(data[5].aboutSection); 
        setInfoBoxes(data[6].infoBoxes);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const toggleTheme = () => {
      // --- MENSAJE DE CONSOLA PARA DEPURACIÓN ---
      console.log('Botón presionado. Cambiando tema...');
      setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        console.log(`Tema anterior: ${prevTheme}, Nuevo tema: ${newTheme}`);
        return newTheme;
      });
    };

    const apiRequest = async (endpoint: string, method: string, body?: any) => {
      try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: body ? JSON.stringify(body) : undefined
        });
        const data = await response.json();
        if (data.success) {
          await fetchData();
          return true;
        }
        alert(data.message || 'Ocurrió un error.');
        return false;
      } catch (error) {
        console.error(`Error en ${method} ${endpoint}:`, error);
        return false;
      }
    };

    const apiFormDataRequest = async (endpoint: string, method: string, formData: FormData) => {
      try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
          method,
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          await fetchData();
          return true;
        }
        alert(data.message || 'Ocurrió un error.');
        return false;
      } catch (error) {
        console.error(`Error en ${method} ${endpoint} con FormData:`, error);
        return false;
      }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/login.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        });
        const data = await response.json();
        if (data.success) {
          setAuth({
            isAuthenticated: true,
            user: data.user
          });
          return true;
        }
        alert(data.message || 'Usuario o contraseña incorrectos.');
        return false;
      } catch (error) {
        console.error("Error en el login:", error);
        return false;
      }
    };

    const logout = () => {
      setAuth({
        isAuthenticated: false,
        user: null
      });
    };

    const updateAboutSection = (formData: FormData) => apiFormDataRequest('about.php', 'POST', formData);

    const addHeroSlide = (formData: FormData) => apiFormDataRequest('hero.php', 'POST', formData);
    const updateHeroSlide = (formData: FormData) => apiFormDataRequest('hero.php', 'POST', formData);
    const deleteHeroSlide = (slideId: number) => apiRequest(`hero.php?id=${slideId}`, 'DELETE');

    const addCourse = (formData: FormData) => apiFormDataRequest('courses.php', 'POST', formData);
    const updateCourse = (formData: FormData) => apiFormDataRequest('courses.php', 'POST', formData);
    const deleteCourse = (courseId: number) => apiRequest(`courses.php?id=${courseId}`, 'DELETE');

    const addCategory = (category: Omit<Category, 'id'>) => apiRequest('categories.php', 'POST', category);
    const updateCategory = (category: Category) => apiRequest('categories.php', 'PUT', category);
    const deleteCategory = (categoryId: number) => apiRequest(`categories.php?id=${categoryId}`, 'DELETE');

    const addUser = (user: Omit<User, 'id'> & {
      password?: string
    }) => apiRequest('users.php', 'POST', user);
    const updateUser = (user: User & {
      password?: string
    }) => apiRequest('users.php', 'PUT', user);
    const deleteUser = (userId: number) => apiRequest(`users.php?id=${userId}`, 'DELETE');

    const updateSiteIdentity = (formData: FormData) => apiFormDataRequest('site_identity.php', 'POST', formData);
    const updateSocialLink = (socialLink: {
      id: string,
      url: string
    }) => apiRequest('social_links.php', 'PUT', socialLink);

    const updateInfoBoxes = (data: InfoBoxData) => apiRequest('infoboxes.php', 'POST', data);

    const value: SiteContextType = {
      siteIdentity,
      socialLinks,
      users,
      categories,
      courses,
      auth,
      isLoading,
      theme,
      toggleTheme,
      login,
      logout,
      addCourse,
      updateCourse,
      deleteCourse,
      addCategory,
      updateCategory,
      deleteCategory,
      addUser,
      updateUser,
      deleteUser,
      updateSiteIdentity,
      updateSocialLink,
      heroSlides,
      addHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
      aboutSection,
      updateAboutSection,
        infoBoxes,
        updateInfoBoxes,
    };

    return <SiteContext.Provider value={
      value
    } > {
        children
      } </SiteContext.Provider>;
  };