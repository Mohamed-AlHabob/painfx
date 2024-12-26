'use client'

import { ReactNode, useEffect, useState } from 'react'
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
  const [instance] = useState(() => {
    const i18nInstance = i18next.createInstance()
    i18nInstance
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        ...getOptions(locale),
        lng: locale,
        detection: {
          order: ['localStorage', 'htmlTag'],
          caches: ['localStorage'],
        },
        resources: languages.reduce((acc: { [x: string]: { translation: any } }, lang: string | number) => {
          acc[lang] = {
            translation: require(`@/i18n/locales/${lang}/translation.json`)
          }
          return acc
        }, {} as Record<string, { translation: Record<string, string> }>)
      })
    return i18nInstance
  })

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || locale
    instance.changeLanguage(storedLang)
  }, [instance, locale])

  return (
    <I18nextProvider i18n={instance}>
      {children}
    </I18nextProvider>
  )
}

