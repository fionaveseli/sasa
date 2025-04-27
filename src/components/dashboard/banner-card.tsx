import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BannerCardProps {
  title: string;
  description: string;
  button: string;
  role: string;
}
const roleGradients: Record<string, string> = {
  student: "linear-gradient(90deg, #3d9c6c, #9ed478)",
  university_manager: "linear-gradient(90deg, #42afa1, #78d4a8)",
  admin: "linear-gradient(90deg, #f6d365, #fda085)",
  default: "linear-gradient(90deg, #3d9c6c, #9ed478)",
};

export default function BannerCard({
  title,
  description,
  button,
  role,
}: BannerCardProps) {
  const backgroundGradient = roleGradients[role] || roleGradients["default"];

  const finalDescription =
    role === "university_manager"
      ? "It's time to lead your university to victory!"
      : role === "admin"
      ? "Oversee, empower - the game is in your hands."
      : description;

  const bannerImageSrc =
    {
      university_manager: "/banner-image1.png",
      admin: "/banner-image2.png",
      default: "/banner-image.png",
    }[role] || "/banner-image.png";

  return (
    <div className="relative flex justify-center">
      <Card
        className="relative flex flex-col md:flex-row items-center justify-between rounded-2xl overflow-visible p-6 w-full max-w-5xl h-[250px]"
        style={{ background: backgroundGradient }}
      >
        <div className="flex flex-col justify-center items-start space-y-4 text-white max-w-[400px] z-10">
          <p className="text-xs uppercase tracking-wide"> {title}</p>
          <h2 className="text-3xl font-semibold leading-tight">
            {finalDescription}
          </h2>

          <Link href="/dashboard/tournaments" className="w-fit">
            <Button className="bg-white text-black hover:bg-gray-100 gap-2">
              {button} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
      <div className="absolute right-10 -top-9 w-72 h-72">
        <Image src={bannerImageSrc} alt="" fill className="object-contain" />
      </div>
    </div>
  );
}
