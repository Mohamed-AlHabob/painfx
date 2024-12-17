import { ReservationDetails } from "./reservation-details";


export default function ReservationPage({ params }: { params: { reservationId: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Reservation Details</h1>
      <ReservationDetails reservationId={params.reservationId}  />
    </div>
  )
}

