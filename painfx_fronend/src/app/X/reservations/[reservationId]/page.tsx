import { ReservationDetails } from "@/features/control/reservation/components/reservation-details";

export default async function ReservationPage({ params }: {  params: Promise<{ reservationId: string }>}) {
  const reservationId = (await params).reservationId
  return (
      <main className="container max-w-7xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <ReservationDetails reservationId={reservationId}/>
        </div>
      </main>
  )
}

