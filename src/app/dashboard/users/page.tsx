"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/app-context";
import { getUsersFromUniversity, UniversityUser } from "@/api/userService";
import { getSearchParams } from "@/utils/paginationUtils";
import Table from "@/components/table";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "sonner";

export default function Users() {
  const searchParams = useSearchParams();
  const params = useParams();
  const universityId = Number(params.id);

  const [users, setUsers] = useState<UniversityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  const { user } = useContext(AppContext);

  const fetchUniversityUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("TOKEN");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      const res = await getUsersFromUniversity(universityId, token);
      if (res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error("Error fetching university users");
    } finally {
      setLoading(false);
    }
  };

  const formatUsers = (data: UniversityUser[]) => {
    return data.map((user, index) => ({
      id: user.id || index + 1,
      fullName: user.fullName,
      email: user.email,
      role: getRoleBadge(user.role),
      graduationYear: user.graduationYear,
      view: (
        <Button
          className="border-0 hover:text-primary bg-transparent"
          variant="outline"
          onClick={() => handleViewUser(user.id)}
        >
          View
        </Button>
      ),
    }));
  };

  const handleViewUser = (userId: number) => {
    window.location.href = `/dashboard/users/${userId}`;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "university_manager":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Manager
          </Badge>
        );
      case "student":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Student
          </Badge>
        );
      case "professor":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Professor
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {role}
          </Badge>
        );
    }
  };

  const columns = [
    { accessorKey: "fullName", header: "FULL NAME" },
    { accessorKey: "email", header: "EMAIL" },
    { accessorKey: "role", header: "ROLE" },
    { accessorKey: "graduationYear", header: "GRADUATION YEAR" },
    { accessorKey: "view", header: "VIEW PROFILE" },
  ];

  useEffect(() => {
    const allParams = getSearchParams(searchParams);
    setPage(Number(allParams.page) || 0);
    setSize(Number(allParams.size) || 10);
    setSearch(allParams.search || "");
  }, [searchParams]);

  useEffect(() => {
    fetchUniversityUsers();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[80vh] w-full">
              <MoonLoader size={20} color="#200936" />
            </div>
          ) : (
            <Table
              columns={columns}
              rows={formatUsers(users)}
              loading={loading}
              size={size}
              page={page}
              totalRows={users.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}
