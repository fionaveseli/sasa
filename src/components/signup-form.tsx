import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-5xl ">Create Your Account</h1>
        <p className="text-balance text-lg text-muted-foreground">
          Stay updated on your tournaments!
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@uni.edu" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Graduation Year</Label>
          <Input id="name" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password"> Confirm Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="flex gap-2 flex-col">
          <Link href="/dashboard">
            <Button type="submit" variant={"submit"} className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
