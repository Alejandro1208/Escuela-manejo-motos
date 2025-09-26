import * as React from 'react';

export interface Course {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  images: string[];
  whatsappLink?: string;
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
  icon: string; 
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
  password?: string; 
}

export interface SiteIdentity {
  id?: number;
  logo: string;
  siteName: string;
  primaryColor: string;
  footerText: string;
  contactPhone: string;
  contactAddress: string;
  mapIframe: string;
  contactEmail: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  sort_order: number;
}

export interface AboutSectionData {
  title: string;
  content: string;
  image_url: string;
}

export interface InfoBoxData {
  title1: string;
  content1: string;
  title2: string;
  content2: string;
  title3: string;
  content3: string;
}