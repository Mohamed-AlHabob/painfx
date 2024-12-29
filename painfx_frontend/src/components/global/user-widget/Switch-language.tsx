'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    <div className="space-y-2 border border-input bg-background shadow-sm max-x-500 rounded-xl flex items-center">
      <div className=" flex justify-between space-x-2">
        <Select defaultValue={currentLang} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
