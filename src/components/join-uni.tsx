import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "./ui/card";

export function JoinUni({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Card>
      <div
        className={cn(
          "flex flex-col gap-6 items-center text-center p-10",
          className
        )}
        {...props}
      >
        <div>
          <h1 className="text-4xl">You’re almost there!</h1>
          <p className="font-extralight text-lg">
            Just one more step to access your account.
          </p>
        </div>
        <div className="grid gap-2 w-full">
          <div className="flex items-center">
            <Label htmlFor="password">Join a University</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button variant={"submit"} className="w-full">
          Ready for SASA
        </Button>
        <p className="text-sm">
          Don't see your university here?{" "}
          <Link href="#" className="text-primary">
            Add your university.
          </Link>
        </p>
      </div>
    </Card>
  );
}
