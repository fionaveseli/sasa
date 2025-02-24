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
  getPaginationNumbers,
  handlePage,
  handleSize,
} from "@/utils/paginationUtils";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[];
  rows: Row[];
  loading?: boolean;
  page?: number;
  size?: number;
  totalRows?: number;
  disablePaginations?: boolean;
  rowCount?: number;
}

export const ShadcnTable = ({
  columns,
  rows,
  loading = false,
  page = 0,
  size = 10,
  totalRows = 0,
  disablePaginations = false,
  rowCount = 10,
}: TableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [numbers, setNumbers] = React.useState<number[]>([]);
  const totalPages = Math.ceil(totalRows / size);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectPage = (page: number) => {
    if (!disablePaginations) handlePage(router, pathname, searchParams, page);
  };

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

  React.useEffect(() => {
    if (page >= totalPages) {
      selectPage(0);
      return;
    }
    setNumbers(getPaginationNumbers(page, totalPages));
  }, [page, totalPages]);

  return (
    <div className="w-full">
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader className="uppercase hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, headerIndex) => (
                  <TableHead
                    key={header.id}
                    className={
                      columns.length === 2
                        ? headerIndex === 0
                          ? "text-left"
                          : "text-right"
                        : ""
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
              rowCount={rowCount}
              columnCount={columns.length}
            />
          )}

          {!loading && (
            <TableBody>
              {rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className={`hover:bg-muted `}>
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={
                          columns.length === 2
                            ? cellIndex === 0
                              ? "text-left"
                              : "text-right"
                            : ""
                        }
                      >
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
                    colSpan={columns.length}
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
      {!disablePaginations && totalRows > 0 && (
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <Paginations
            totalPages={totalPages}
            page={page}
            handlePage={selectPage}
            numbers={numbers}
          />
        </div>
      )}
    </div>
  );
};

export default ShadcnTable;
