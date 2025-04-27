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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/components/nav-user";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AppContext);
  const router = useRouter();

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
                className="w-full pl-8 h-8 border-[#5B4A6B] focus:border-[#5B4A6B] focus:ring-[#5B4A6B]"
              />
            </div>
          </div>

          {/* Right Section - Notifications and Welcome Message */}
          <div className="flex items-center gap-4">
            <div className="text-white text-xs font-light">
              <div>Enjoy your game</div>
              <div>{user?.role?.replace(/_/g, " ")}, {user?.fullName}</div>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center w-8 h-8 focus:outline-none data-[state=open]:bg-primary rounded-lg">
                  <Bell className="h-5 w-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[300px] rounded-lg animate-fade-in"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <p className="text-sm font-semibold">Notifications</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 text-sm text-muted-foreground">
                  No new notifications
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
