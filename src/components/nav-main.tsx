"use client";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <a
                  href={item.url}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors ${
                    isActive ? " text-white" : " text-[#A69DAF]"
                  }`}
                >
                  {item.icon && (
                    <item.icon
                      className={isActive ? "text-secondary" : "text-[#A69DAF]"}
                    />
                  )}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
