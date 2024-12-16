import { ReservationList } from "@/features/control/reservation/components/reservation-list";

export default function UsersPage() {
  return (
      <main className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">
            View and manage Reservations
          </p>
        </div>
        <ReservationList/>
      </main>
  )
}

