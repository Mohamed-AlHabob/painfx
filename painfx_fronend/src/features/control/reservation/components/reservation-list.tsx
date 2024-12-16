'use client';

import { useState } from 'react';
import { Reservation } from '@/schemas/Reservation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { useGetReservationsQuery } from '@/redux/services/booking/ReservationApiSlice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserCard from '@/components/global/user-widget/user-card';
import Link from 'next/link';
import { useModal } from '@/hooks/use-modal-store';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { Spinner } from '@/components/spinner';
import { NoResult } from '@/components/global/no-results';

export function ReservationList() {
  const {onOpen} = useModal();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [tab, setTab] = useState('all');
  const { data: reservations, isLoading, error } = useGetReservationsQuery("");
  const { data: user, isLoading:isLoadingRetrieveUser } = useRetrieveUserQuery();

  if (isLoading || isLoadingRetrieveUser) return <div className="flex justify-center items-center">
  <Spinner />
</div> ;

  if (!reservations || error) {
    return <NoResult message={''} backTo={''}/>;
  }

  // const filteredReservations = reservations.filter((reservation : Reservation) => {
  //   const matchesSearch =
  //     reservation?.patient?.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
  //     reservation?.patient?.user?.last_name?.toLowerCase().includes(search.toLowerCase());

  //   if (tab === 'all') return matchesSearch;
  //   return matchesSearch && reservation.status?.toLowerCase() === tab;
  // });

  // const sortedReservations = [...filteredReservations].sort((a, b) => {
  //   if (sortBy === 'date') {
  //     return new Date(b.reservationDate || 0).getTime() - new Date(a.reservationDate || 0).getTime();
  //   }
  //   return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  // });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
          <Tabs defaultValue="all"className="space-y-6" value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <span className="flex items-center gap-2">
                Sort by:
                <SelectValue placeholder="Select" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reservation_date">Reservation Date</SelectItem>
              <SelectItem value="created">Created At</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border">
        <Table>
        <TableHeader>
                <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer hover:text-foreground">
                    <div className="flex items-center gap-2">
                    Date & Time
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
          <TableBody>
            {Array.isArray(reservations) && reservations.map((reservation : Reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                 <div className="flex items-center gap-3">
                    <UserCard
                      name={`${reservation?.patient?.user?.first_name || 'Unknown'} ${reservation?.patient?.user?.last_name || ''}`}
                      email={reservation?.patient?.user?.email || ''}
                      phone_number={reservation?.patient?.user?.profile?.phone_number || ''}
                      avatar={reservation?.patient?.user?.profile?.avatar || ''}
                      joined={reservation?.patient?.user?.date_joined || ''}
                      address={reservation?.patient?.user?.profile?.address || ''}
                      id={reservation?.patient?.user?.id || ''}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className={`${getStatusColor(reservation?.status || "")} text-white`}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="font-medium">
                    {reservation.reservation_date
                      ? format(new Date(reservation.reservation_date), 'MMM d, yyyy')
                      : 'Date not set'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reservation.reservation_time || 'Time not set'}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user?.role === "doctor" || user?.role === "clinic" ? (
                      <>
                      <DropdownMenuItem>
                        <Link href={`/branch/reservations/${reservation.id}`}>View</Link>
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpen("ConfirmChangeStatus", { reservation: reservation, Status: "approved" })}>Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpen("ConfirmChangeStatus", { reservation: reservation, Status: "rejected" })}>Reject</DropdownMenuItem>
                      </>
                      ):
                      <DropdownMenuItem onClick={() => onOpen("ConfirmChangeStatus", { reservation: reservation, Status: "cancelled" })} className="text-red-600">Cancelled</DropdownMenuItem>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        </Tabs>
  );
}