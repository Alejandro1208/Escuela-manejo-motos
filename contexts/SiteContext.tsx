import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { SiteIdentity, SocialLink, User, Category, Course } from '../types';

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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCourse: (course: Course) => Promise<boolean>;
  deleteCourse: (courseId: number) => Promise<boolean>;
  updateSiteIdentity: (identity: Partial<SiteIdentity>) => Promise<boolean>;
  updateUserRole: (userId: number, role: string) => Promise<boolean>;
  isLoading: boolean; 
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

  const fetchData = async () => {
    setIsLoading(true); 
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
      setIsLoading(false); // Desactivar estado de carga al terminar
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      return false;
    } catch (error) {
      console.error("Error en el login:", error);
      return false;
    }
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  const updateCourse = async (course: Course): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/courses.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      return false;
    }
  };
  
  const deleteCourse = async (courseId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/courses.php?id=${courseId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      return false;
    }
  };
  
  const updateSiteIdentity = async (identity: Partial<SiteIdentity>): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/site_identity.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(identity)
        });
        const data = await response.json();
        if (data.success) {
            fetchData();
            return true;
        }
        return false;
      } catch (error) {
          console.error("Error al actualizar la identidad:", error);
          return false;
      }
  };

   const updateUserRole = async (userId: number, role: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/users.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, role: role })
        });
        const data = await response.json();
        if (data.success) {
            fetchData();
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error al actualizar rol de usuario:", error);
        return false;
    }
  };

  const value: SiteContextType = {
    siteIdentity,
    socialLinks,
    users,
    categories,
    courses,
    auth,
    login,
    logout,
    updateCourse,
    deleteCourse,
    updateSiteIdentity,
    updateUserRole,
    isLoading 
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};