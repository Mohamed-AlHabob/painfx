import { Badge } from '@/components/ui/badge'
import { ConfigCard } from '@/features/control/components/config-card'

export default function ClinicConfigPage() {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Clinic Information
        </h1>
        <p className="text-muted-foreground">
          Configure your clinic's basic information and operational settings
        </p>
      </div>

      <div className="space-y-6">
        <ConfigCard
          title="Basic Information"
          description="Manage your clinic's core details"
          features={[
            {
              title: "Clinic Name",
              description: "Your clinic's official name as it appears to patients and partners",
              enabled: true,
            },
            {
              title: "Contact Information",
              description: "Manage phone numbers, email addresses, and physical address",
              enabled: true,
              options: (
                <div className="flex gap-4 mt-2">
                  <Badge variant="outline">Phone</Badge>
                  <Badge variant="outline">Email</Badge>
                  <Badge variant="outline">Address</Badge>
                </div>
              ),
            },
          ]}
        />

        <ConfigCard
          title="Operational Hours"
          description="Set your clinic's regular operating hours and special schedules"
          features={[
            {
              title: "Regular Hours",
              description: "Set standard operating hours for each day of the week",
              enabled: true,
            },
            {
              title: "Special Hours",
              description: "Configure hours for holidays or special events",
              enabled: false,
              premium: true,
            },
          ]}
        />

        <ConfigCard
          title="Services Offered"
          description="Manage the list of medical services your clinic provides"
          features={[
            {
              title: "Service Categories",
              description: "Organize your services into categories for easy navigation",
              enabled: true,
            },
            {
              title: "Individual Services",
              description: "Add, edit, or remove specific services with descriptions and pricing",
              enabled: true,
            },
          ]}
        />

        <ConfigCard
          title="Expansion Features"
          description="Enable features to support clinic growth and development"
          features={[
            {
              title: "Multi-location Support",
              description: "Manage multiple clinic locations under one account",
              enabled: false,
              premium: true,
            },
            {
              title: "Equipment Tracking",
              description: "Keep track of medical equipment, maintenance schedules, and procurement",
              enabled: false,
              premium: true,
            },
            {
              title: "Partnership Management",
              description: "Manage relationships with other healthcare providers and services",
              enabled: false,
              premium: true,
            },
          ]}
        />
      </div>
    </main>
  )
}

