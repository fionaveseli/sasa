"use client";

import { useState } from "react";
import TabsModel from "@/components/tabs-model";
import { TabsType } from "@/types/dto/TabsType";
import University from "@/components/dashboard/university";
import { Button } from "@/components/ui/button";
import CreateTournamentModal from "@/components/modal/create-tournament-modal";

enum Tabs {
  University = "University",
  International = "International",
}

const allowedViews = ["University", "International"];

export default function TournamentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex flex-col space-y-4 px-4 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal">Tournaments</h1>
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
        >
          Create Tournament
        </Button>
      </div>

      <TabsModel
        tabs={tabs}
        defaultTab={Tabs.University}
        viewPermissions={allowedViews}
      />

      <CreateTournamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
