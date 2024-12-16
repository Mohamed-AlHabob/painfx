'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ReservationsTable() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [tab, setTab] = useState('all');

  const reservations = [
    {
      id: '1',
      patient: { name: 'John Doe', avatar: '', email: 'john.doe@example.com' },
      clinic: { name: 'Downtown Clinic', address: '123 Main St' },
      reservation_date: '2024-12-05',
      reservation_time: '14:30',
      createdAt: '2024-12-01T10:00:00Z',
      status: 'Pending',
      doctor: { name: 'Dr. Smith' },
      review: { review_text: 'Great service!', rating: 5 },
    },
    {
      id: '2',
      patient: { name: 'John Doe', avatar: '', email: 'john.doe@example.com' },
      clinic: { name: 'Downtown Clinic', address: '123 Main St' },
      reservation_date: '2004-12-05',
      reservation_time: '14:30',
      createdAt: '2024-12-01T10:00:00Z',
      status: 'cancelled',
      doctor: { name: 'Dr. Smith' },
      review: { review_text: 'Great service!', rating: 5 },
    },
    {
      id: '3',
      patient: { name: 'John Doe', avatar: '', email: 'john.doe@example.com' },
      clinic: { name: 'Downtown Clinic', address: '123 Main St' },
      reservation_date: '2024-12-05',
      reservation_time: '14:30',
      createdAt: '2024-11-01T10:00:00Z',
      status: 'approved',
      doctor: { name: 'Dr. Smith' },
      review: { review_text: 'Great service!', rating: 5 },
    },
    {
      id: '4',
      patient: { name: 'John Doe', avatar: '', email: 'john.doe@example.com' },
      clinic: { name: 'Downtown Clinic', address: '123 Main St' },
      reservation_date: '2024-12-05',
      reservation_time: '14:30',
      createdAt: '2024-12-01T10:00:00Z',
      status: 'rejected',
      doctor: { name: 'Dr. Smith' },
      review: { review_text: 'Great service!', rating: 5 },
    },
   
  ];

  const filteredReservations = reservations?.filter((reservation) => {
    const matchesSearch =
      reservation.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      reservation.clinic.name.toLowerCase().includes(search.toLowerCase());

    if (tab === 'all') return matchesSearch;
    return matchesSearch && reservation.status.toLowerCase() === tab;
  });

  const sortedReservations = [...(filteredReservations || [])].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Create Reservation
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
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
            <SelectItem value="date">Reservation Date</SelectItem>
            <SelectItem value="created">Created At</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={reservation.patient.avatar} />
                    <AvatarFallback>
                      {reservation.patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{reservation.patient.name}</div>
                    <div className="text-sm text-muted-foreground">{reservation.patient.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{reservation.clinic.name}</div>
                <div className="text-sm text-muted-foreground">{reservation.clinic.address}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={`${getStatusColor(reservation.status)} text-white`}>
                  {reservation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {format(new Date(reservation.reservation_date), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reservation.reservation_time}
                </div>
              </TableCell>
              <TableCell>{format(new Date(reservation.createdAt), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem>Reject</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

