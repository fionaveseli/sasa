"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AddUniversityForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    universityName: "",
    universityAddress: "",
    contactNumber: "",
    agreeToTerms: false,
    logo: null,
    bannerColor: "",
    bio: "",
  });

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-12 font-extralight">
      {/* <Card> */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left side */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-medium">Add Your University!</h2>
            <p className="text-gray-500 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing.
            </p>
          </div>
          <div className="flex gap-2 mt-10 justify-center">
            <div
              className={`w-3 h-3 rounded-full ${
                step === 1 ? "bg-purple-700" : "bg-purple-300"
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                step === 2 ? "bg-purple-700" : "bg-purple-300"
              }`}
            ></div>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-96">
          {step === 1 && (
            <>
              <div>
                <Label>University Name</Label>
                <Input placeholder="" />
              </div>
              <div>
                <Label>University Address</Label>
                <Input placeholder="" />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input placeholder="" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <a className="underline">Terms of Services</a>{" "}
                  and <a className="underline">Privacy Policy</a>
                </Label>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
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
                  <div className="border h-20 rounded-md flex items-center justify-center text-sm text-gray-400 ">
                    Drag & drop files or Browse
                  </div>
                </div>
                <div>
                  <Label>Banner Color</Label>
                  <Input type="text" value="#E7712E" className="bg-[#fff]" />
                </div>
              </div>
              <div className="mt-0">
                <Label>Bio</Label>
                <Textarea rows={4} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Previous
                </Button>
                <Link href="/signup/university-form/verify">
                  <Button>
                    Next <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
