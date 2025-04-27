"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Contact,
  Frame,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Trophy,
  University,
  Users,
  Dices,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { cn } from "@/lib/utils";

export const navItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: House,
    roles: ["student", "university_manager", "admin"],
  },
  {
    title: "University Page",
    url: "/dashboard/university",
    icon: University,
    roles: ["student", "university_manager", "admin"],
  },
  {
    title: "Teams",
    url: "/dashboard/teams",
    icon: Users,
    roles: ["student", "university_manager", "admin"],
  },
  {
    title: "Tournaments",
    url: "/dashboard/tournaments",
    icon: Trophy,
    roles: ["student", "university_manager", "admin"],
  },
  {
    title: "Matches",
    url: "/dashboard/matches",
    icon: Dices,
    roles: ["student", "university_manager", "admin"],
  },
  {
    title: "Team Page",
    url: "/dashboard/team-page",
    icon: Contact,
    roles: ["admin"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    roles: ["student", "university_manager", "admin"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const [sidebarImage, setSidebarImage] = React.useState("/logo1.svg");
  const [userData, setUserData] = React.useState({
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "student",
  });

  React.useEffect(() => {
    // Update sidebar image based on open state
    if (open) {
      setSidebarImage(`/logo1.svg`);
    } else setSidebarImage("/vercel.svg");

    // Get user data from localStorage
    const getUserData = () => {
      try {
        const storedUser = localStorage.getItem("USER");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData({
            name: user.fullName || "User",
            email: user.email || "user@example.com",
            avatar: user.avatar || "/avatars/shadcn.jpg",
            role: user.role || "student",
          });
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, [open]);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userData.role)
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img
          className={cn("h-8", sidebarImage === "/logo1.svg" && "mx-2")}
          src={sidebarImage}
          alt="Logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
