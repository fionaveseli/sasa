import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function AlmostThereCard({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
      <Card>
      <div className={cn("flex flex-col gap-6 items-center text-center p-10", className)} {...props}>
      <div>
            <h1 className="text-4xl">You're almost there!</h1>
            <p className="font-extralight text-lg">Just one more step to access your account.</p>
          </div>
          <div className="w-full text-left">
            <Label htmlFor="university" className="font-extralight text-base">Join a University</Label>
            <select id="university" className="w-full p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
            <option></option>
              <option>University A</option>
              <option>University B</option>
            </select>
          </div>
          <Link href="/signup/success">
            <Button variant={"submit"} className="w-full">Ready for sasa</Button>
          </Link>
          <p className="text-sm">
            Don't see your university here? <Link href="#" className="text-primary">Add your university</Link>
          </p>
        </div>
      </Card>
    );
  }
  