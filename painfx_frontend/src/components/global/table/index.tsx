import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import React from 'react'

type DataTableProps = {
  headers: string[]
  children: React.ReactNode
}

export const DataTable = ({ headers, children }: DataTableProps) => {
  return (
    <Table className="rounded-t-xl overflow-hidden">
      <TableHeader>
        <TableRow>
          {headers.map((header, key) => (
            <TableHead
              key={key}
              className={cn(
                key === headers.length - 1 && 'text-right',
                ''
              )}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {React.Children.map(children, (child) => (
          <TableRow>{child}</TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
