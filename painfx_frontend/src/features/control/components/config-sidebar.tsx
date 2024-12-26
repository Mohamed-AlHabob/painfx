"use client"

import { Building, Users, Calendar, FileText, Settings, CreditCard, Activity, Stethoscope, Briefcase, Shield, Mail, Bell, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const categories = [
  {
    title: "Clinic Management",
    items: [
      { icon: Building, label: "Clinic Information", href: "/configure", active: true },
      { icon: Users, label: "Staff Management", href: "/configure/staff" },
      { icon: Calendar, label: "Appointment Settings", href: "/configure/appointments" },
      { icon: FileText, label: "Medical Records", href: "/configure/records" },
      { icon: Settings, label: "Services & Procedures", href: "/configure/services" },
    ],
  },
  {
    title: "Financial Management",
    items: [
      { icon: CreditCard, label: "Billing & Invoicing", href: "/configure/billing" },
      { icon: Activity, label: "Financial Reports", href: "/configure/reports" },
    ],
  },
  {
    title: "Expansion & Development",
    items: [
      { icon: Stethoscope, label: "Equipment Management", href: "/configure/equipment" },
      { icon: Briefcase, label: "Partnerships", href: "/configure/partnerships" },
    ],
  },
  {
    title: "Compliance & Security",
    items: [
      { icon: Shield, label: "Data Protection", href: "/configure/data-protection" },
      { icon: FileText, label: "Regulatory Compliance", href: "/configure/compliance" },
    ],
  },
  {
    title: "Communication",
    items: [
      { icon: Mail, label: "Patient Communications", href: "/configure/communications" },
      { icon: Bell, label: "Notifications", href: "/configure/notifications" },
    ],
  },
]

export function ConfigSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <div className="py-4 space-y-6">
      {categories.map((category) => (
        <div key={category.title} className="space-y-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">
            {category.title}
          </h3>
          <div className="space-y-1">
            {category.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.active && "bg-accent text-accent-foreground"
                )}
                onClick={() => setIsOpen(false)}
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

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block w-64 border-r min-h-screen">
        <SidebarContent />
      </div>
    </>
  )
}

