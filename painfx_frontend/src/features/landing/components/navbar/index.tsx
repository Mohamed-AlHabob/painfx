'use client'

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MenuIcon } from 'lucide-react'
import { useAppSelector } from "@/redux/hooks"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import GlassSheet from "@/components/global/glass-sheet"
import { Menu } from "./menu"
import { Logout } from "@/components/icons"
import { useTranslation } from "react-i18next"

export function LandingPageNavbar() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/X')
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl">{t('brand')}</span>
        </Link>
        <div className="hidden lg:flex flex-1 justify-center">
          <Menu orientation="desktop" isAuthenticated={isAuthenticated} />
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-2xl flex items-center">
                <Logout />
                <span>{t('login')}</span>
             </Button>
            </Link>
          )}
          
          <div className="hidden lg:flex">
            <ModeToggle />
          </div>

          <div className="lg:hidden">
            <GlassSheet
              triggerClass="lg:hidden"
              trigger={
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">{t('open_menu')}</span>
                </Button>
              }
            >
              <Menu orientation="mobile" isAuthenticated={isAuthenticated} />
            </GlassSheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
