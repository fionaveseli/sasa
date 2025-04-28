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
import { Bell, SearchIcon, ChevronDown } from "lucide-react";
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
import { api } from "@/services/api";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AppContext);
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.search(
        value,
        searchType === "all" ? undefined : searchType
      );
      setSearchResults(response);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleTypeChange = (type: string) => {
    setSearchType(type);
    if (searchQuery.trim().length >= 2) {
      debouncedSearch(searchQuery);
    }
  };

  const handleResultClick = (type: string, id: number) => {
    router.push(`/dashboard/${type}/${id}`);
    setSearchResults(null);
  };

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
          <div className="flex-1 max-w-md mx-4 relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search universities, teams, tournaments..."
                className="w-full pl-8 pr-8 h-8 border-[#5B4A6B] focus:border-[#5B4A6B] focus:ring-[#5B4A6B]"
                onChange={handleSearch}
                value={searchQuery}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="absolute right-0 top-0 h-8 px-2 border-none border-0 bg-transparent hover:bg-transparent text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:outline-none">
                    {searchType === "all"
                      ? "All"
                      : searchType.charAt(0).toUpperCase() +
                        searchType.slice(1)}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleTypeChange("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTypeChange("universities")}
                  >
                    Universities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("teams")}>
                    Teams
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTypeChange("tournaments")}
                  >
                    Tournaments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("users")}>
                    Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {loading && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5B4A6B]"></div>
                </div>
              )}
            </div>
            {searchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border bg-white border-gray-200 max-h-96 overflow-y-auto z-50">
                {Object.entries(searchResults).map(
                  ([type, items]: [string, any]) =>
                    items.length > 0 && (
                      <div key={type} className="p-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </h3>
                        {items.map((item: any) => (
                          <button
                            key={item.id}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                            onClick={() => handleResultClick(type, item.id)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          {/* Right Section - Notifications and Welcome Message */}
          <div className="flex items-center gap-4">
            <div className="text-white text-xs font-light">
              <div>Enjoy your game</div>
              <div>
                {user?.role
                  ?.replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
                , {user?.fullName?.replace(/^\w/, (c) => c.toUpperCase())}
              </div>{" "}
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
