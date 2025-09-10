import React, { createContext, useState, ReactNode } from 'react';
import type { SiteIdentity, SocialLink, User, Category, Course } from '../types';
import { initialSiteIdentity, initialSocialLinks, initialUsers, initialCategories, initialCourses } from '../data/initialData';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export interface SiteContextType {
  siteIdentity: SiteIdentity;
  socialLinks: SocialLink[];
  users: User[];
  categories: Category[];
  courses: Course[];
  auth: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCourse: (course: Course) => boolean;
  deleteCourse: (courseId: number) => boolean;
  updateSiteIdentity: (identity: Partial<SiteIdentity>) => boolean;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteIdentity, setSiteIdentity] = useState<SiteIdentity>(initialSiteIdentity);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });

  // Dummy login logic. In a real app, this would be a secure API call.
  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username);
    // Use a simple password check for the demo (e.g., admin/admin, editor/editor).
    if (user && password === user.username) { 
      setAuth({ isAuthenticated: true, user: user.username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  const updateCourse = (course: Course): boolean => {
    setCourses(prevCourses => prevCourses.map(c => c.id === course.id ? course : c));
    return true;
  };
  
  const deleteCourse = (courseId: number): boolean => {
    setCourses(prevCourses => prevCourses.filter(c => c.id !== courseId));
    return true;
  };

  const updateSiteIdentity = (identity: Partial<SiteIdentity>): boolean => {
    setSiteIdentity(prev => ({ ...prev, ...identity }));
    return true;
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
    updateSiteIdentity
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
