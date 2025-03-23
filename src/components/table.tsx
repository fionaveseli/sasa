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
}

export const ShadcnTable = ({
  columns,
  rows,
  loading = false,
  page = 0,
  size = 10,
  totalRows = 0,
  disablePaginations = false,
}: TableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const totalPages = Math.ceil(totalRows / size);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
  });

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-xl">
      <Table className="w-full border-separate border-spacing-y-2">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-100 text-gray-700">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="p-4 text-left text-sm font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {loading && (
          <SkeletonLoader type="table" rowCount={10} columnCount={columns.length} />
        )}
        {!loading && (
          <TableBody>
            {rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="bg-white hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4 text-center text-gray-500">
                  <EmptyState message="No data available" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
      {!disablePaginations && totalRows > 0 && (
        <div className="flex justify-end mt-4">
          <Paginations totalPages={totalPages} page={page} handlePage={() => { } } numbers={[]} />
        </div>
      )}
    </div>
  );
};

export default ShadcnTable;
