import { MoreHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'

const data = [
  {
    id: "1",
    email: "user@example.com",
    status: "active",
    lastSeen: "2 minutes ago",
    sessionDuration: "1h 20m",
  },
  {
    id: "2",
    email: "another@example.com",
    status: "active",
    lastSeen: "5 minutes ago",
    sessionDuration: "45m",
  },
  {
    id: "3",
    email: "test@example.com",
    status: "inactive",
    lastSeen: "2 hours ago",
    sessionDuration: "2h 15m",
  },
]

export function ActivityTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Session Duration</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    row.status === "active" ? "bg-emerald-500" : "bg-gray-300"
                  }`} />
                  {row.status}
                </div>
              </TableCell>
              <TableCell>{row.lastSeen}</TableCell>
              <TableCell>{row.sessionDuration}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>End Session</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

ActivityTable.Skeleton = function ActivityTableSkeleton() {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr>
            {["Email", "Status", "Last Seen", "Session Duration", "Actions"].map((header) => (
              <th key={header} className="px-4 py-2">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">
                <Skeleton className="h-4 w-48" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-4 w-8" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}