import { Settings } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface ConfigCardProps {
  title: string
  description: string
  children?: React.ReactNode
  features?: {
    title: string
    description: string
    enabled?: boolean
    pro?: boolean
    options?: React.ReactNode
  }[]
}

export function ConfigCard({ title, description, children, features }: ConfigCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {children}
        {features?.map((feature, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{feature.title}</span>
                {feature.pro && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-500">
                    Pro
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
              {feature.options}
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Switch checked={feature.enabled} />
              <button className="text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

