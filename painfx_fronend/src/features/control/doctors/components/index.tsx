'use client';

import { ChevronDown, MoreHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import UserCard from "@/components/global/user-widget/user-card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { useGetClinicsQuery } from '@/redux/services/booking/ClinicApiSlice';

export default function DoctorsPage() {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [tab, setTab] = useState('all');
  const { data, isLoading, isError } = useGetClinicsQuery({page:1});
   const doctors = data?.results || [];
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !doctors) {
    return <div>Error loading doctors data. Please try again later.</div>;
  }

  return (
    <Tabs defaultValue="all"className="space-y-6" value={tab} onValueChange={setTab}>
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="pending">Pending</TabsTrigger>
    </TabsList>
<div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
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
              <Select defaultValue="joined" value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      Sort by: <span className="font-medium">Joined</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joined">Joined</SelectItem>
                  <SelectItem value="last-signed-in">Last signed in</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-[#7857FF] hover:bg-[#7857FF]/90">
              Add Doctor
            </Button>
          </div>
<div className="rounded-lg border">
<Table>
<TableHeader>
        <TableRow>
        <TableHead>Doctor</TableHead>
        <TableHead>Specialization</TableHead>
          <TableHead className="cursor-pointer hover:text-foreground">
            <div className="flex items-center gap-2">
              Last Login
              <ChevronDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
  <TableBody>
    {doctors.map((doctor: { address?: string; name?: string | null; id?: string; description?: string | null; specialization?: { name?: string | null; id?: string; } | null; user?: { id: string; first_name: string; last_name: string; email: string; profile: { phone_number: string; avatar: string; address: string; }; date_joined: string; last_login: Date; }; }, index: number) => (
      <TableRow key={doctor.user?.id || doctor.id || index}>
        <TableCell>
         <div className="flex items-center gap-3">
            <UserCard
              name={`${doctor.user?.first_name || doctor.name || 'Unknown'} ${doctor.user?.last_name || ''}`}
              email={doctor.user?.email || ''}
              phone_number={doctor.user?.profile?.phone_number || ''}
              avatar={doctor.user?.profile?.avatar || ''}
              joined={doctor.user?.date_joined || ''}
              address={doctor.user?.profile?.address || doctor.address || ''}
              id={doctor.user?.id || doctor.id || ''}
            />
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          <Badge variant={"outline"}>
            {doctor.specialization?.name || 'Unknown'}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          <div className="font-medium">
            {doctor.user?.last_login
              ? format(new Date(doctor.user.last_login), 'MMM d, yyyy')
              : 'Date not set'}
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
              <DropdownMenuItem>
                <Link href={`/branch/reservations/${doctor.user?.id || doctor.id}`}>View</Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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