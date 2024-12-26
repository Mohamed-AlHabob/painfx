'use client'

import { Key, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18n/settings'

export default function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<string>(i18n.language)

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || i18n.language
    setCurrentLang(storedLang)
    document.documentElement.lang = storedLang
    document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  const handleLanguageChange = (lang: string) => {
    localStorage.setItem('lang', lang)
    i18n.changeLanguage(lang)
    setCurrentLang(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    router.refresh()
  }

  return (
    <div>
      {languages.map((lang: string) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 rounded ${currentLang === lang ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

