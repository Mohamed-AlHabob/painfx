'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages } from '@/i18n/settings'

interface TranslationsProviderProps {
  children: ReactNode
  locale: string
}

export default function TranslationsProvider({
  children,
  locale
}: TranslationsProviderProps) {
  const instance = useMemo(() => {
    const i18nInstance = i18next.createInstance()
    const storedLang = localStorage.getItem('lang') || locale

    i18nInstance
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        ...getOptions(storedLang),
        lng: storedLang, // Use stored language or fallback to locale
        detection: {
          order: ['localStorage', 'htmlTag'],
          caches: ['localStorage'],
          lookupLocalStorage: 'lang',
        },
        resources: languages.reduce(
          (acc: Record<string, { translation: Record<string, string> }>, lang) => {
            acc[lang] = {
              translation: require(`@/i18n/locales/${lang}/translation.json`)
            }
            return acc
          },
          {}
        )
      })
    return i18nInstance
  }, [locale])

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || locale
    if (storedLang !== instance.language) {
      instance.changeLanguage(storedLang)
    }
  }, [instance, locale])

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
