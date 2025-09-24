
import * as React from 'react';

export interface Course {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  images: string[];
}

export interface Category {
  id: number;
  title: string;
  requirements: string[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export enum UserRole {
  ADMIN = 'Administrador',
  EDITOR = 'Editor',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface SiteIdentity {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface SiteIdentity {
  id?: number; 
  logo: string;
  site_name: string; 
  primaryColor: string;
  secondaryColor: string;
  footer_text: string;
  contact_phone: string;
  contact_address: string;
  map_iframe: string;
}