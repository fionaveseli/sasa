import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Assuming Card is in components/ui/card
import Link from "next/link";

export function NewUni({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Card className={cn("p-10", className)} {...props}>
      <div className="flex flex-col items-center text-center gap-6 font-extralight">
        {/* Icon and title */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
            <span className="text-lime-600 text-2xl">!</span>
          </div>
          <h1 className="text-3xl ">Warning</h1>
        </div>

        {/* Message */}
        <p className="text-muted-foreground text-base max-w-xl">
          By adding your university,{" "}
          <span className="font-medium">
            you agree to be the University Manager
          </span>
          , which means you{" "}
          <span className="font-medium">cannot participate as a player</span>{" "}
          later. You can always assign this role to someone else in the
          University Manager page.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          <Link href="/signup/university">
            <Button variant="outline" className="w-full">
              Go back
            </Button>
          </Link>
          <Link href="/signup/university-form">
            <Button variant="default" className="w-full">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
