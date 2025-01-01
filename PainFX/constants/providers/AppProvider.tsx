import React from 'react';
import { LanguageProvider } from '../LanguageContext';
import { ThemeProvider } from '../ThemeContext';


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
};

