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

const data = {
  user: {
    name: "Fiona",
    email: "fionav@auk.org",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users,
    },
    {
      title: "Tournaments",
      url: "/dashboard/tournaments",
      icon: Trophy,
    },
    {
      title: "University Page",
      url: "/dashboard/university",
      icon: University,
    },
    {
      title: "Team Page",
      url: "/dashboard/team-page",
      icon: Contact,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const [sidebarImage, setSidebarImage] = React.useState("/logo1.svg");
  React.useEffect(() => {
    if (open) {
      setSidebarImage(`/logo1.svg`);
    } else setSidebarImage("/vercel.svg");
  }, [open]);
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
