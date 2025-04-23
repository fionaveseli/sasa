"use client";

import type { JSX } from "react";
import { useState } from "react";

import type { TabsType } from "@/types/dto/TabsType";
import { getSearchParams, handleTab } from "@/utils/paginationUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";
import EmptyState from "./empty-state";
import CreateTournamentModal from "./modal/create-tournament-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TabsModelProps {
  tabs: TabsType[];
  defaultTab: string;
  viewPermissions: string[];
}

const MemoizedTabsContent = memo(
  ({ value, component }: { value: string; component: JSX.Element }) => (
    <TabsContent value={value}>{component}</TabsContent>
  )
);

export default function TabsModel({
  tabs,
  defaultTab,
  viewPermissions,
}: TabsModelProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const allParams = getSearchParams(searchParams);
  const initialTab = allParams.tab || defaultTab;
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabClick = (value: string) => {
    if (value !== activeTab) {
      setActiveTab(value);

      const newParams = new URLSearchParams();
      handleTab(router, pathname, newParams, value);
    }
  };

  const filteredTabs = tabs.filter((tab) => viewPermissions.includes(tab.key));

  if (viewPermissions.length === 0) {
    return <EmptyState />;
  }

  if (viewPermissions.length === 1) {
    const singleTab = tabs.find((tab) => tab.key === viewPermissions[0]);
    return singleTab ? singleTab.component : null;
  }

  return (
    <Tabs defaultValue={activeTab}>
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between">
          <TabsList>
            {filteredTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => handleTabClick(tab.value)}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <CreateTournamentModal />
        </div>
      </div>
      {filteredTabs.map((tab) => (
        <MemoizedTabsContent
          key={tab.key}
          value={tab.value}
          component={tab.component}
        />
      ))}
    </Tabs>
  );
}
