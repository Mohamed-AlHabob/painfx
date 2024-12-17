import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function Stats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value="2,345"
        change={12}
      />
      <StatCard
        title="Active Sessions"
        value="1,234"
        change={-4}
      />
      <StatCard
        title="Sign-ups Today"
        value="24"
        change={8}
      />
      <StatCard
        title="Average Session"
        value="12m"
        change={2}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: number
}

function StatCard({ title, value, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {change > 0 ? (
            <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 text-red-500" />
          )}
          <span className={cn(
            change > 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {Math.abs(change)}%
          </span>
          <span>vs last week</span>
        </div>
      </CardContent>
    </Card>
  )
}

