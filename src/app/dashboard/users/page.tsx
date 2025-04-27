"use client";

import { useContext, useEffect, useState } from "react";

import { AppContext } from "@/context/app-context";
import { getUsersFromUniversity } from "@/api/userService";
import { Badge } from "@/components/ui/badge";
import Table from "@/components/table";

export default function UniversityUsers() {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);

  const universityId = user?.university_id;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!universityId || !token) return;

        setLoading(true);
        const response = await getUsersFromUniversity(universityId, token);
        setUsers(formatUsers(response.data?.users ?? []));
      } catch (error) {
        console.error("Error fetching users from university:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [universityId, token]);

  const columns = [
    { accessorKey: "fullName", header: "FULL NAME" },
    { accessorKey: "email", header: "EMAIL" },
    {
      accessorKey: "role",
      header: "ROLE",
      cell: ({ row }: { row: { original: any } }) => (
        <Badge variant="outline" className="px-3 py-1">
          {row.original.role.replace(/_/g, " ")}
        </Badge>
      ),
    },
    { accessorKey: "graduationYear", header: "GRADUATION YEAR" },
  ];

  const formatUsers = (data: any[]) => {
    return data.map((user: any, index: number) => ({
      id: user.id || index + 1,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      graduationYear: user.graduationYear,
    }));
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <h1 className="text-2xl font-normal">Users</h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            rows={users}
            loading={loading}
            size={10}
            page={0}
            totalRows={users.length}
          />
        </div>
      </div>
    </div>
  );
}
