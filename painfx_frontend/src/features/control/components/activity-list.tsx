import { NoResult } from '@/components/global/no-results'
import UserCard from '@/components/global/user-widget/user-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Doctor } from '@/schemas'



interface ActivityListProps {
  title: string
  doctors: Doctor[]
}

export function ActivityList({ title, doctors }: ActivityListProps) {
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="space-y-4">
        {doctors.map((doctor, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <UserCard id={doctor.id || ""} avatar={doctor?.user?.profile?.avatar || ""} name={`${doctor.user?.first_name} ${doctor.user?.last_name}`} email={doctor.user?.email} phone_number={doctor.user?.profile?.phone_number|| ""} address={doctor.user?.profile?.address || ""} joined={doctor.user?.created_at || ""} />
            <p className="text-sm text-muted-foreground">{""}</p>
          </div>
      </div>
        ))}
    </div>
    </div>
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        <Skeleton className="h-4 w-32" />
      </h3>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}