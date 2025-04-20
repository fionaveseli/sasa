"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/api/userService";
import { RegisterUser } from "@/types/dto/users/RegisterUser";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    graduationYear: "",
    timeZone: "UTC",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload: RegisterUser = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        graduationYear: parseInt(form.graduationYear),
        timeZone: form.timeZone,
        role: "student",
      };

      console.log("Registering with payload:", payload);

      const res = await registerUser(payload);

      if (res.data) {
        const { user, token } = res.data;
        console.log(res.data);
        localStorage.setItem("token", token);
        localStorage.setItem("USER", JSON.stringify(user));

        router.push("/signup/almost-there");
      } else {
        setError(res.error?.title || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-5xl">Create Your Account</h1>
        <p className="text-balance text-lg text-muted-foreground">
          Stay updated on your tournaments!
        </p>
      </div>

      <div className="grid gap-6">
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="m@uni.edu"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Input
            id="graduationYear"
            name="graduationYear"
            value={form.graduationYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-2 flex-col">
          <Button
            type="submit"
            variant={"submit"}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
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
