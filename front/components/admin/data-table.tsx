'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableProps {
  title: string;
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  loading?: boolean;
  maxHeight?: string;
}

export function DataTable({ title, columns, data, loading = false, maxHeight = 'max-h-[400px]' }: DataTableProps) {
  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-sm sm:text-base font-semibold mb-4">{title}</h3>
      <div className="flex-1 min-h-0">
        <div className={`w-full h-full overflow-x-auto ${maxHeight}`} style={{ maxHeight: '100%' }}>
          <Table className="min-w-full table-fixed">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className="text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: 180 }}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className="text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: 180 }}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
