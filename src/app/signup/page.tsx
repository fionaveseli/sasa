import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh">
      <div className="flex m items-center justify-center py-8">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
