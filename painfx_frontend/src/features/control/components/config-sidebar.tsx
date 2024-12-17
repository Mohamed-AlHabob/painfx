"use client"

import { AtSign, KeyRound, Wallet, Shield, ShieldAlert, Boxes, FileKey, Scale, Settings, Users, LayoutDashboard, UserCircle, Mail } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const categories = [
  {
    title: "User & Authentication",
    items: [
      { icon: AtSign, label: "Email, phone, username", href: "/configure", active: true },
      { icon: KeyRound, label: "SSO connections", href: "/configure/sso" },
      { icon: Wallet, label: "Web3", href: "/configure/web3" },
      { icon: Shield, label: "Multi-factor", href: "/configure/mfa" },
      { icon: ShieldAlert, label: "Restrictions", href: "/configure/restrictions" },
      { icon: Shield, label: "Attack protection", href: "/configure/protection" },
    ],
  },
  {
    title: "Session management",
    items: [
      { icon: Boxes, label: "Sessions", href: "/configure/sessions" },
      { icon: FileKey, label: "JWT templates", href: "/configure/jwt" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { icon: Scale, label: "Legal", href: "/configure/legal" },
    ],
  },
  {
    title: "Organization management",
    items: [
      { icon: Settings, label: "Settings", href: "/configure/org-settings" },
      { icon: Users, label: "Roles and Permissions", href: "/configure/roles" },
    ],
  },
  {
    title: "Customization",
    items: [
      { icon: LayoutDashboard, label: "Account Portal", href: "/configure/portal" },
      { icon: UserCircle, label: "Avatars", href: "/configure/avatars" },
      { icon: Mail, label: "Emails", href: "/configure/emails" },
    ],
  },
]

export function ConfigSidebar() {
  return (
    <div className="w-64 border-r min-h-[calc(100vh-104px)] p-6 space-y-6">
      {categories.map((category) => (
        <div key={category.title} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {category.title}
          </h3>
          <div className="space-y-1">
            {category.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.active && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

