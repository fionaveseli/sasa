import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <Skeleton className="flex flex-1 items-center justify-center"></Skeleton>
    </div>
  );
}
