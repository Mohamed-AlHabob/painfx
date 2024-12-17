'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetReservationQuery } from '@/redux/services/booking/ReservationApiSlice'
import { LeafletMap } from '@/components/global/map'
import { Input } from '@/components/ui/input'
import UserProfileSidebar from '@/components/global/user-widget/user-profile-sidebar'
import { Loader } from "@/components/global/loader"
import { Check, Google } from "@/components/icons"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Reservation } from "@/schemas/Reservation"
import { NoResult } from "@/components/global/no-results"

interface ReservationDetailsProps {
  reservationId: string
}

export function ReservationDetails({ reservationId }: ReservationDetailsProps) {
  const { data, isLoading, error } = useGetReservationQuery(reservationId)
  const reservation = data as Reservation || []

  if (isLoading) return <Loader loading={isLoading} />

  if (!reservation || error) {
    return <NoResult message={'No results found'} backTo={'/post'} linkName={"back"}/>;
  }

  return (
    <>
     <div className="sticky top-16 h-fit">
       <UserProfileSidebar 
         name={`${reservation?.patient?.user?.first_name || 'Unknown'} ${reservation?.patient?.user?.last_name || ''}`}
         id={reservation?.patient?.user?.id || ''} 
         last_login={reservation?.patient?.user?.last_login || ''} 
         joined={reservation?.patient?.user?.date_joined || ''} 
       />
     </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                 <h2>Basic information</h2> 
                  <Badge variant="outline" className="gap-1">
                    <Check  />
                    {reservation.status}
                  </Badge>
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Manage Reservations</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Reservation Date</h3>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <span>{format(new Date(reservation.reservation_date || ""), 'ppp')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Reservation Time</h3>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <span>{reservation.reservation_time}</span>
                  {/* {reservation.status === 'verified' &&
                  <Badge variant="outline" className="gap-1">
                    <Check className="h-3 w-3" />
                    Verified
                  </Badge>
                  } */}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Phone numbers</h3>
              <p className="text-sm text-muted-foreground">{reservation?.patient?.user?.profile?.phone_number || ''} </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Social accounts</h3>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Google />
                  <span>Google</span>
                </div>
                <span className="text-sm text-muted-foreground">
                {reservation?.patient?.user?.email || ''} 
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Web3 wallets</h3>
              <p className="text-sm text-muted-foreground">None</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Medical history</h3>
              <p className="text-sm text-muted-foreground">{reservation?.patient?.medical_history || 'no Medical history'} </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Doctor&apos;s information</CardTitle>
            <p className="text-sm text-muted-foreground">Manage Doctor&apos;s information settings</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Docter</label>
              <Input disabled defaultValue={`${reservation.doctor || 'Unknown'}`}  />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Location</CardTitle>
          </CardHeader>
          <CardContent>
            <LeafletMap latitude={48.8584} longitude={2.2945} zoom={15} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
