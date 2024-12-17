'use client'

import Link from "next/link"
import { MenuIcon } from 'lucide-react'
import { useAppSelector } from "@/redux/hooks"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import { ModeToggle } from "@/components/mode-toggle"
import { Logout } from "@/components/icons"
import GlassSheet from "@/components/global/glass-sheet"
import { Menu } from "./menu"

export function LandingPageNavbar() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  const renderAuthLinks = () => {
    if (isLoading) return <Spinner size="lg" />
    return <Link href="/X ">Dashboard</Link>
  }

  const renderGuestLinks = () => {
    if (isLoading) {
      return (
        <div className="flex items-center mx-9">
          <Spinner />
        </div>
      )
    }
    return (
      <Button variant="outline" className="rounded-2xl flex items-center">
        <Logout />
        <span>Login</span>
      </Button>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl">PainFX.</span>
        </Link>
        <div className="hidden lg:flex flex-1 justify-center">
          <Menu orientation="desktop" isAuthenticated={isAuthenticated} />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            {isAuthenticated ? renderAuthLinks() : renderGuestLinks()}
          </Link>
          
          <div className="hidden lg:flex">
            <ModeToggle />
          </div>

          <div className="lg:hidden">
            <GlassSheet
              triggerClass="lg:hidden"
              trigger={
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
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
