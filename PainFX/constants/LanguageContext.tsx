import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import ku from '../locales/ku.json';

const i18n = new I18n({
  en,
  ar,
  ku,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, params?: object) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: async () => {},
  t: (key: string) => key,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(Localization.locale.split('-')[0]);

  useEffect(() => {
    loadLocale();
  }, []);

  const loadLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem('locale');
      if (savedLocale !== null) {
        setLocaleState(savedLocale);
        i18n.locale = savedLocale;
      } else {
        i18n.locale = locale;
      }
    } catch (error) {
      console.error('Error loading locale:', error);
    }
  };

  const setLocale = useCallback(async (newLocale: string) => {
    setLocaleState(newLocale);
    i18n.locale = newLocale;
    try {
      await AsyncStorage.setItem('locale', newLocale);
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  }, []);

  const t = useCallback((key: string, params?: object) => i18n.t(key, params), []);

  const isRTL = ['ar', 'ku'].includes(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
