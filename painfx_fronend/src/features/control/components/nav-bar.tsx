"use client"

import { ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

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

export function NavBar() {
 const {data} = useGetClinicsQuery({page:1})
 const clinic = data as Clinic
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
    <DropdownMenuItem >
      {clinic?.privacy ? 'Public' : 'Privacy'}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <UserDropDown/>
        </div>
      </div>
    </header>
  )
}

