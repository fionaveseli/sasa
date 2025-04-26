"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppContext, AppContextProvider } from "@/context/app-context";
import { Separator } from "@radix-ui/react-separator";
import { Bell, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/components/nav-user";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AppContext);
  const router = useRouter();

  // Get initials from user's full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const userInitials = user?.fullName ? getInitials(user.fullName) : "?";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="w-full flex h-12 shrink-0 items-center justify-between px-4 bg-primary-foreground sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 h-8"
              />
            </div>
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center gap-4">
            <button className="relative inline-flex items-center justify-center rounded-full w-8 h-8">
              <Bell className="h-5 w-5 text-white fill-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-white text-primary hover:bg-white/90">
                  <span className="text-sm font-medium">{userInitials}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => router.push("/dashboard/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => router.push("/dashboard/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full justify-center text-center"
                    onClick={logout}
                  >
                    Log out
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="w-full p-3 pt-0 flex-1 bg-primary-foreground">
          <Card className="rounded-lg bg-white min-h-[90vh] w-full overflow-y-auto p-6">
            {children}
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProvider>
      <DashboardContent>{children}</DashboardContent>
    </AppContextProvider>
  );
}
