"use client"

import { Building2, ChevronDown, CreditCard, Grid, LayoutGrid, Lock, Settings, Users } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Building2 className="h-4 w-4" />
              <span className="flex-1 text-left">Organization</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            <DropdownMenuItem>
              <span>My Organization</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Create Organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium uppercase text-muted-foreground">Overview</h3>
            <NavItem href="#" icon={Grid}>Dashboard</NavItem>
            <NavItem href="#" icon={Users}>Users</NavItem>
            <NavItem href="#" icon={Lock}>Sessions</NavItem>
          </div>
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium uppercase text-muted-foreground">Settings</h3>
            <NavItem href="#" icon={LayoutGrid}>Applications</NavItem>
            <NavItem href="#" icon={CreditCard}>Billing</NavItem>
            <NavItem href="#" icon={Settings}>Settings</NavItem>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function NavItem({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        href === "#" && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
