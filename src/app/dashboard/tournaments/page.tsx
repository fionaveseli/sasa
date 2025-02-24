"use client";

import TabsModel from "@/components/tabs-model";
import { TabsType } from "@/types/dto/TabsType";
import University from "@/components/dashboard/university";

enum Tabs {
  University = "University",
  International = "International",
}

const allowedViews = ["University", "International"];

export default function Home() {
  const tabs: TabsType[] = [
    {
      key: "University",
      value: Tabs.University,
      label: "University",
      component: <University />,
    },
    {
      key: "International",
      value: Tabs.International,
      label: "International",
      component: <University />,
    },
  ];

  return (
    <TabsModel
      tabs={tabs}
      defaultTab={Tabs.University}
      viewPermissions={allowedViews}
    />
  );
}
