import { LanguageContext } from '@/constants/LanguageContext';
import { ThemeContext } from '@/constants/ThemeContext';
import { useContext } from 'react';


export const useAppContext = () => {
  const { locale, setLocale, t, isRTL } = useContext(LanguageContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return {
    locale,
    setLocale,
    t,
    isRTL,
    isDarkMode,
    toggleTheme,
  };
};

