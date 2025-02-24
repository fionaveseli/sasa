"use client";

import { getSearchParams } from "@/utils/paginationUtils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "../table";

export default function Users() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Dummy loading state

  // Define table columns
  const columns = [
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
  ];

  // Dummy data for table rows
  const rows = [
    { firstname: "John", lastname: "Doe", email: "john.doe@example.com" },
    { firstname: "Jane", lastname: "Smith", email: "jane.smith@example.com" },
    { firstname: "Alice", lastname: "Brown", email: "alice.brown@example.com" },
    { firstname: "Bob", lastname: "Johnson", email: "bob.johnson@example.com" },
    {
      firstname: "Charlie",
      lastname: "Williams",
      email: "charlie.w@example.com",
    },
    { firstname: "Emily", lastname: "Davis", email: "emily.davis@example.com" },
    {
      firstname: "Michael",
      lastname: "Miller",
      email: "michael.miller@example.com",
    },
    { firstname: "Emma", lastname: "Moore", email: "emma.moore@example.com" },
    {
      firstname: "Olivia",
      lastname: "Taylor",
      email: "olivia.taylor@example.com",
    },
    {
      firstname: "Liam",
      lastname: "Anderson",
      email: "liam.anderson@example.com",
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
          rows={rows} // Now using dummy data
          loading={loading}
          size={size}
          page={page}
          totalRows={rows.length} // Use dummy row count
        />
      </div>
    </div>
  );
}
