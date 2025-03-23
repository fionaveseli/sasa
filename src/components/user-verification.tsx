import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function UserVerificationCard({
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
          <h1 className="text-4xl">Please Check Your Email</h1>
          <p className="font-extralight text-lg">
            We’ve sent a code to m@uni.edu
          </p>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {[...Array(6)].map((_, index) => (
            <Input
              key={index}
              className="text-center text-2xl w-12 h-12"
              maxLength={1}
            />
          ))}
        </div>
        <Link href="/signup/almost-there">
          <Button variant={"submit"} className="w-full">
            Verify
          </Button>
        </Link>
        <p className="text-sm">
          Didn&apos;t receive an email?{" "}
          <Link href="#" className="text-primary">
            Resend code.
          </Link>
        </p>
      </div>
    </Card>
  );
}
