import UserCard from '@/components/global/user-widget/user-card'
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
            <UserCard id={doctor.id || ""} avatar={doctor?.user?.profile?.avatar || ""} name={`${doctor.user?.first_name} ${doctor.user?.last_name}`} email={doctor.user?.email} phone_number={doctor.user?.profile?.phone_number|| ""} address={doctor.user?.profile?.address || ""} joined={doctor.user?.date_joined || ""} />
            <p className="text-sm text-muted-foreground">{""}</p>
          </div>
      </div>
        ))}
    </div>
    </div>
  )
}