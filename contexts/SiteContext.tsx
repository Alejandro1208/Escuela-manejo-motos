import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { SiteIdentity, SocialLink, User, Category, Course } from '../types';

// Se define el tipo para el tema, que puede ser 'light' o 'dark'
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
  // Funciones para Cursos
  addCourse: (formData: FormData) => Promise<boolean>;
  updateCourse: (formData: FormData) => Promise<boolean>;
  deleteCourse: (courseId: number) => Promise<boolean>;
  // Funciones para Categorías
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: number) => Promise<boolean>;
  // Funciones para Usuarios
  addUser: (user: Omit<User, 'id'> & { password?: string }) => Promise<boolean>;
  updateUser: (user: User & { password?: string }) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
  // Funciones para Identidad y Redes
  updateSiteIdentity: (formData: FormData) => Promise<boolean>;
  updateSocialLink: (socialLink: { id: string, url: string }) => Promise<boolean>;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

const API_URL = 'https://alejandrosabater.com.ar/api';

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteIdentity, setSiteIdentity] = useState<SiteIdentity | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('light');

  // Efecto para cargar el tema desde el almacenamiento local al iniciar la app
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/site_identity.php`),
        fetch(`${API_URL}/social_links.php`),
        fetch(`${API_URL}/users.php`),
        fetch(`${API_URL}/courses.php`),
      ]);
      const data = await Promise.all(responses.map(res => res.json()));
      setSiteIdentity(data[0].siteIdentity);
      setSocialLinks(data[1].socialLinks);
      setUsers(data[2].users);
      setCourses(data[3].courses);
      setCategories(data[3].categories);
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
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const apiRequest = async (endpoint: string, method: string, body?: any) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setAuth({ isAuthenticated: true, user: data.user });
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
    setAuth({ isAuthenticated: false, user: null });
  };

  // --- CRUD Functions ---
  const addCourse = (formData: FormData) => apiFormDataRequest('courses.php', 'POST', formData);
  const updateCourse = (formData: FormData) => apiFormDataRequest('courses.php', 'POST', formData);
  const deleteCourse = (courseId: number) => apiRequest(`courses.php?id=${courseId}`, 'DELETE');
  
  const addCategory = (category: Omit<Category, 'id'>) => apiRequest('categories.php', 'POST', category);
  const updateCategory = (category: Category) => apiRequest('categories.php', 'PUT', category);
  const deleteCategory = (categoryId: number) => apiRequest(`categories.php?id=${categoryId}`, 'DELETE');

  const addUser = (user: Omit<User, 'id'> & { password?: string }) => apiRequest('users.php', 'POST', user);
  const updateUser = (user: User & { password?: string }) => apiRequest('users.php', 'PUT', user);
  const deleteUser = (userId: number) => apiRequest(`users.php?id=${userId}`, 'DELETE');

  const updateSiteIdentity = (formData: FormData) => apiFormDataRequest('site_identity.php', 'POST', formData);
  const updateSocialLink = (socialLink: { id: string, url: string }) => apiRequest('social_links.php', 'PUT', socialLink);

  const value: SiteContextType = {
    siteIdentity, socialLinks, users, categories, courses, auth, isLoading,
    theme,
    toggleTheme,
    login, logout, addCourse, updateCourse, deleteCourse, addCategory, updateCategory,
    deleteCategory, addUser, updateUser, deleteUser, updateSiteIdentity, updateSocialLink
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};