import { UserVerificationCard } from "@/components/user-verification";

export default function Verification() {
  return (
    <div className="grid min-h-svh">
      <div className="flex m items-center justify-center py-8">
        <div className="w-full max-w-xl">
          <UserVerificationCard />
        </div>
      </div>
    </div>
  );
}
