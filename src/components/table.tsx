"use client";
import * as React from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Paginations from "./paginations";
import EmptyState from "./empty-state";
import { SkeletonLoader } from "./skeleton-loader";
import { getPaginationNumbers } from "@/utils/paginationUtils";

interface Row {
  [key: string]: any;
}

interface TableProps {
  columns: ColumnDef<any>[];
  rows: Row[];
  loading?: boolean;
  page?: number;
  size?: number;
  totalRows?: number;
  disablePaginations?: boolean;
  onPageChange?: (page: number) => void;
}

export const ShadcnTable = ({
  columns,
  rows,
  loading = false,
  page = 0,
  size = 10,
  totalRows = 0,
  disablePaginations = false,
  onPageChange,
}: TableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const totalPages = Math.ceil(totalRows / size);
  const numbers = getPaginationNumbers(page, totalPages);

  const enhancedColumns: ColumnDef<any>[] = [...columns];

  const table = useReactTable({
    data: rows,
    columns: enhancedColumns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
  });

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <Table className="rounded-md">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary/10">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-4 text-left text-sm font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {loading && (
            <SkeletonLoader
              type="table"
              rowCount={10}
              columnCount={enhancedColumns.length}
            />
          )}

          {!loading && (
            <TableBody>
              {rows.length > 0 ? (
                table
                  .getRowModel()
                  .rows.slice(page * size, (page + 1) * size)
                  .map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={enhancedColumns.length}
                    className="h-24 text-center"
                  >
                    <EmptyState message="No data available" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {!disablePaginations && totalPages > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t z-10">
          <div className="flex justify-center p-2">
            <Paginations
              totalPages={totalPages}
              page={page}
              handlePage={onPageChange}
              numbers={numbers}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadcnTable;
