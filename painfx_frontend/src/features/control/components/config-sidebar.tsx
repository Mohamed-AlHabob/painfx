"use client"

import { Building, Users, Calendar, FileText, Settings, CreditCard, Activity, Stethoscope, Briefcase, Shield, Mail, Bell } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

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

