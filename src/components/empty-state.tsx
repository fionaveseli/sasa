import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Image
        src={"/logo1.svg"}
        alt="empty"
        width={120}
        height={120}
        className="dark:invert dark:brightness-0"
      />

      <p className="text-sidebar-foreground text-center">
        {message || "No data available"}
      </p>
    </div>
  );
};

export default EmptyState;
