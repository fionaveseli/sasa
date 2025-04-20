"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getUniversities, University } from "@/api/userService";
import { useRouter } from "next/navigation";
import axios from "axios";

export function AlmostThereCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUniversities = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing.");
        return;
      }

      const res = await getUniversities(token);
      if (res.data) {
        setUniversities(res.data.universities);
      } else {
        setError("Failed to fetch universities.");
      }
    };

    fetchUniversities();
  }, []);

  const handleNext = async () => {
    if (!selectedUniversity) {
      setError("Please select a university");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing.");
        return;
      }

      // Update the user with the selected university ID
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://web-production-3dd4c.up.railway.app/api";
      await axios.patch(
        `${API_BASE_URL}/users/me`,
        { university_id: parseInt(selectedUniversity) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user data in localStorage to include university_id
      const userData = JSON.parse(localStorage.getItem("USER") || "{}");
      userData.university_id = parseInt(selectedUniversity);
      localStorage.setItem("USER", JSON.stringify(userData));

      router.push("/signup/success");
    } catch (err: any) {
      console.error("Failed to update university:", err);
      setError(err.response?.data?.message || "Failed to update university");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div
        className={cn(
          "flex flex-col gap-6 items-center text-center p-10",
          className
        )}
        {...props}
      >
        <div>
          <h1 className="text-4xl">You're almost there!</h1>
          <p className="font-extralight text-lg">
            Just one more step to access your account.
          </p>
        </div>

        <div className="w-full text-left">
          <Label htmlFor="university" className="font-extralight text-base">
            Join a University
          </Label>
          <select
            id="university"
            className="w-full p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="">Select your university</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <Button
          onClick={handleNext}
          variant={"submit"}
          className="w-full"
          disabled={!selectedUniversity || loading}
        >
          {loading ? "Processing..." : "Ready for sasa"}
        </Button>

        <p className="text-sm">
          Don't see your university here?{" "}
          <Link href="/signup/new-university" className="text-primary">
            Add your university
          </Link>
        </p>
      </div>
    </Card>
  );
}
