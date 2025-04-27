"use client";

import { SuccessCard } from "@/components/success";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <SuccessCard />
    </div>
  );
}
