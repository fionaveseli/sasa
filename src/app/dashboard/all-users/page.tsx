"use client";

import { useContext, useEffect, useState } from "react";

import { AppContext } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import Table from "@/components/table";
import { getAllUsersFromAllUniversities } from "@/api/userService";

export default function AdminUsers() {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) return;

        setLoading(true);
        const response = await getAllUsersFromAllUniversities(token);
        setUsers(flattenUsers(response.data?.universities ?? []));
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const columns = [
    { accessorKey: "fullName", header: "FULL NAME" },
    { accessorKey: "email", header: "EMAIL" },
    {
      accessorKey: "role",
      header: "ROLE",
      cell: ({ row }: { row: { original: any } }) => (
        <Badge variant="outline" className="px-3 py-1 capitalize">
          {row.original.role.replace(/_/g, " ")}
        </Badge>
      ),
    },
    { accessorKey: "graduationYear", header: "GRADUATION YEAR" },
    { accessorKey: "universityName", header: "UNIVERSITY" },
  ];

  const flattenUsers = (universities: any[]) => {
    const allUsers: any[] = [];
    universities.forEach((university) => {
      const { university_name, users } = university;
      users.forEach((user: any) => {
        allUsers.push({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          graduationYear: user.graduationYear,
          universityName: university_name, // attach university name
        });
      });
    });
    return allUsers;
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <h1 className="text-2xl font-normal">All Users</h1>
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
