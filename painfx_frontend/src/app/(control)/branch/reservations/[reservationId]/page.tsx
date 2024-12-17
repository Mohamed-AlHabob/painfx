import { ReservationDetails } from "@/features/control/reservation/components/reservation-details";

type ReservationPageProps = {
  params: Promise<{ reservationId: string }>
  
}
export default async function ReservationPage({ params }: ReservationPageProps) {
  const reservationId = (await params).reservationId

  return (
    <main className="container max-w-7xl mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <ReservationDetails reservationId={reservationId} />
      </div>
    </main>
  );
}
