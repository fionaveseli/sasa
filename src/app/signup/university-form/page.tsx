"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createUniversity } from "@/api/userService";
import { toast } from "sonner";
import { api } from "@/services/api";

export default function AddUniversityForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [form, setForm] = useState({
    universityName: "",
    universityAddress: "",
    contactNumber: "",
    logo: "",
    bannerColor: "#E7712E",
    bio: "",
    agreeToTerms: false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle contact number validation
    if (name === 'contactNumber') {
      // Allow only numbers, +, (, )
      if (!/^[\d+()]*$/.test(value)) {
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const oldToken = localStorage.getItem("TOKEN");

      let uploadedLogoUrl = "";

      if (logoFile) {
        try {
          uploadedLogoUrl = await api.uploadLogo(logoFile);
          console.log("Logo uploaded:", uploadedLogoUrl);
        } catch (uploadError) {
          console.error("Failed to upload logo:", uploadError);
          setError("Failed to upload logo. Please try again.");
          setLoading(false);
          return;
        }
      }

      const finalForm = {
        ...form,
        logo: uploadedLogoUrl,
      };

      const res = (await createUniversity(finalForm, oldToken!)) as {
        data: CreateUniversity;
      };

      if (res.data) {
        const { user, token: authToken } = res.data;

        if (authToken) {
          localStorage.setItem("TOKEN", authToken);
        }
        if (user) {
          localStorage.setItem("USER", JSON.stringify(user));
        }

        toast.success("University created successfully! 🎓");
        router.push("/dashboard");
      } else {
        setError("Something went wrong.");
        toast.error("Failed to create university. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-12 font-extralight">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-medium">Add Your University!</h2>
            <p className="text-gray-500 mt-2">
              Help others find your university and start tournaments.
            </p>
          </div>
          <div className="flex gap-2 mt-10 justify-center">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  step === s ? "bg-purple-700" : "bg-purple-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 w-96">
          {step === 1 && (
            <>
              <div>
                <Label>University Name</Label>
                <Input
                  name="universityName"
                  value={form.universityName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>University Address</Label>
                <Input
                  name="universityAddress"
                  value={form.universityAddress}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  type="tel"
                  pattern="[0-9+()]*"
                  inputMode="tel"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={form.agreeToTerms}
                  onCheckedChange={(val) =>
                    setForm((f) => ({ ...f, agreeToTerms: Boolean(val) }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <span className="underline">Terms</span> and{" "}
                  <span className="underline">Privacy Policy</span>
                </Label>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!form.agreeToTerms || !form.universityName}
                >
                  Next <span className="ml-2">→</span>
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3 w-96">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Logo</Label>
                  <div className="border h-20 rounded-md flex items-center justify-center text-sm text-gray-400 relative">
                    <input
                      type="file"
                      id="fileUpload"
                      className="opacity-0 absolute w-full h-full cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="fileUpload"
                      className="absolute cursor-pointer text-gray-500"
                    >
                      {logoFile ? logoFile.name : "Drag & drop files or Browse"}
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Banner Color</Label>
                  <Input
                    type="text"
                    name="bannerColor"
                    value={form.bannerColor}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !form.bio || !form.bannerColor}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
