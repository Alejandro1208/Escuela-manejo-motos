import { useContext } from 'react';
import { SiteContext, SiteContextType } from '../contexts/SiteContext';

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
