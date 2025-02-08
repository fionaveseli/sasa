import React from "react";

interface InfoCardProps {
  icon: React.ComponentType;
  title: string;
  description: string;
  variant?: "default" | "secondary";
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = "default",
  className,
}) => {
  const variantStyles =
    variant === "default"
      ? "bg-white text-secondary shadow-lg rounded-full"
      : "bg-black text-secondary shadow-lg rounded-xl";

  return (
    <div className={`flex flex-col items-start rounded-lg w-96 ${className}`}>
      <div className={`text-4xl mb-4 p-2 ${variantStyles}`}>
        <Icon />
      </div>
      <h3 className="text-md mb-2">{title}</h3>
      <p className="text-sm font-extralight">{description}</p>
    </div>
  );
};

export default InfoCard;
