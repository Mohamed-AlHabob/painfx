"use client"

import { ChevronDown, HelpCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { UserDropDown } from '@/components/global/user-widget/user'
import { Logo, LogoDark } from '@/components/icons/logo'
import { useGetClinicsQuery } from '@/redux/services/booking/ClinicApiSlice'
import { Clinic } from '@/schemas'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function NavBar() {
  const { data } = useGetClinicsQuery({ page: 1 })
  const clinic = data as Clinic
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="dark:hidden">
            <Logo width={80} height={80} className="my-2" />
          </div>
          <div className="hidden dark:block">
            <LogoDark width={80} height={80} className="my-2" />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                Personal Account
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Switch Account</DropdownMenuItem>
              <DropdownMenuItem>Create Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                Graduation communication platform
                <span className="rounded bg-muted px-2 py-0.5 text-xs">
                  Free
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Upgrade Plan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    clinic?.privacy ? 'bg-orange-400' : 'bg-green-400'
                  }`}
                />
                <span>{clinic?.privacy ? 'Privacy' : 'Public'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                {clinic?.privacy ? 'Public' : 'Privacy'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <UserDropDown />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                <Button variant="ghost" className="justify-start">
                  Personal Account
                </Button>
                <Button variant="ghost" className="justify-start">
                  Graduation communication platform
                  <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">
                    Free
                  </span>
                </Button>
                <Button variant="ghost" className="justify-start">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      clinic?.privacy ? 'bg-orange-400' : 'bg-green-400'
                    } mr-2`}
                  />
                  {clinic?.privacy ? 'Privacy' : 'Public'}
                </Button>
                <Button variant="ghost" className="justify-start">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Help
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
