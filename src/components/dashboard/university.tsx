"use client";

import { getSearchParams } from "@/utils/paginationUtils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "../table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ColumnDef } from "@tanstack/react-table";

interface Tournament {
  tournamentname: string;
  startdate: string;
  enddate: string;
  status: string;
  teamsparticipating: number;
}

export default function Users() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Define table columns with proper cell renderers
  const columns: ColumnDef<Tournament>[] = [
    { 
      accessorKey: "tournamentname",
      header: "TOURNAMENT NAME" 
    },
    { 
      accessorKey: "startdate",
      header: "START DATE" 
    },
    { 
      accessorKey: "enddate",
      header: "END DATE" 
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.status}</Badge>
      ),
    },
    { 
      accessorKey: "teamsparticipating",
      header: "TEAMS PARTICIPATING" 
    },
    {
      accessorKey: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "Upcoming" && <Button>Join</Button>}
          <Button>View</Button>
        </div>
      ),
    },
  ];

  // Dummy data for table rows
  const rows = [
    {
      tournamentname: "RIT Kosovo 2024",
      startdate: "10/11/2024",
      enddate: "20/11/2024",
      status: "Upcoming",
      teamsparticipating: 16,
    },
    {
      tournamentname: "International Open 2024",
      startdate: "15/08/2024",
      enddate: "25/08/2024",
      status: "Finished",
      teamsparticipating: 32,
    },
    {
      tournamentname: "Global Masters 2024",
      startdate: "05/09/2024",
      enddate: "15/09/2024",
      status: "Active",
      teamsparticipating: 24,
    },
    {
      tournamentname: "Summer Showdown",
      startdate: "12/07/2024",
      enddate: "22/07/2024",
      status: "Finished",
      teamsparticipating: 20,
    },
    {
      tournamentname: "Winter Cup",
      startdate: "01/12/2024",
      enddate: "10/12/2024",
      status: "Upcoming",
      teamsparticipating: 12,
    },
  ];

  useEffect(() => {
    const allParams = getSearchParams(searchParams);
    const page = Number(allParams.page) || 0;
    const size = Number(allParams.size) || 10;
    const search = allParams.search || "";

    setPage(page);
    setSize(size);
    setSearch(search);
  }, [searchParams]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <Table
          columns={columns}
          rows={rows}
          loading={loading}
          size={size}
          page={page}
          totalRows={rows.length}
        />
      </div>
    </div>
  );
}
