import { type LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

FeatureCard.Skeleton = function FeatureCardSkeleton() {
  return (
    <div className="hover:border-primary/50 transition-colors">
      <div className="pt-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Skeleton className="h-6 w-6" />
          </div>
          <h3 className="font-semibold">
            <Skeleton className="h-4 w-48" />
          </h3>
          <p className="text-sm text-muted-foreground">
            <Skeleton className="h-3 w-40" />
          </p>
        </div>
      </div>
    </div>
  )
}