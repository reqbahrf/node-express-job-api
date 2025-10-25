import React, { createContext, useContext, ReactNode } from 'react';
import WithLayout from '../utils/WithLayout';
import AppLayout from '../layout/AppLayout';

const LayoutContext = createContext<ReactNode | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  return WithLayout(AppLayout, children);
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
