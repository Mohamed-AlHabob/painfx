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
  
  