import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
    title: string
    value: number
    period: string
  }
  
  export function StatCard({ title, value, period }: StatCardProps) {
    return (
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{period}</p>
      </div>
    )
  }
  
StatCard.Skeleton = function StatCardSkeleton() {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground">
        <Skeleton className="h-4 w-24" />
      </h3>
      <p className="text-3xl font-bold">
        <Skeleton className="h-6 w-16" />
      </p>
      <p className="text-xs text-muted-foreground">
        <Skeleton className="h-3 w-20" />
      </p>
    </div>
  )
}