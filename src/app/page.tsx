"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InfoCard from "@/components/info-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div>
      <Header />
      <div className="items-center justify-items-center min-h-screen pb-20 gap-16 p-4 sm:p-10">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full">
          <Card className="bg-card-foreground w-full p-14 pb-2 flex justify-center relative">
            <div className="flex flex-col gap-8 items-center">
              <p className="text-5xl font-semibold justify-center">
                Unite. Compete. <span className="text-primary">Conquer.</span>
              </p>
              <p className="text-center font-extralight">
                Streamline board game tournaments at your university and beyond.
                Track scores,
                <br /> manage teams, and engage fans—all in one powerful
                platform.
              </p>
              <div className="flex gap-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>

                <Link href="/signup">
                  <Button variant="default">Get Started</Button>
                </Link>
              </div>  
              <img src="/homepage.svg" alt="Image" className="max-w-full" />
              <img
                src="/homepage1.svg"
                alt="Top Image"
                className="absolute bottom-0 left-2/5 transform translate-x-1/2 z-10 "
              />
            </div>
          </Card>
          <section className="py-10">
            <div className="flex flex-col md:flex-row max-w-screen gap-2 justify-between">
              <p className="min-w-[45%] text-3xl">Discover the Features</p>
              <p className="min-w-[45%] text-p font-extralight">
                Explore the key features that make tournament management
                seamless. From joining teams and adding universities to
                receiving real-time notifications, everything you need is in one
                place.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-5 max-w-screen pt-10 justify-center">
              <img
                src="card3-home.svg"
                alt="Feature 1"
                className="w-1/3 object-cover"
              />
              <img
                src="card2-home.svg"
                alt="Feature 2"
                className="w-1/3 object-cover"
              />
              <img
                src="card1-home.svg"
                alt="Feature 3"
                className="w-1/3 object-cover"
              />
            </div>
          </section>
          <section className=" flex justify-center mx-auto">
            <img src="bracket.svg" alt="Feature 1" className="w-full" />
          </section>
          <Card className="w-full p-7 flex justify-between ">
            <div className="flex flex-col md:flex-row max-w-screen gap-4 justify-between w-full items-center">
              <div>
                <p className="min-w-[45%] text-3xl">
                  Ready to Elevate Your Tournaments?
                </p>
                <p className="min-w-[45%] text-p font-extralight">
                  Sign up now to streamline your matches, manage brackets, and
                  track tournament progress with ease.
                </p>
              </div>
              <Button className="md:ml-auto" variant="outline">
                Login
              </Button>
            </div>
          </Card>
          <section className="bg-gradient-to-b from-white to-[#EDE8F3] -mx-10 w-screen py-10">
            <div className="flex flex-col md:flex-row gap-20 w-full justify-end">
              <div className="flex flex-col gap-4 w-[450px]">
                <Card>
                  <InfoCard
                    className="p-6"
                    icon={Star}
                    title="Effortless Tournament Setup"
                    description="Create and launch tournaments in just a few clicks, making competition management easier than ever."
                  />
                </Card>
                <Card>
                  <InfoCard
                    className="p-6"
                    icon={Star}
                    title="Engage Fans Like Never Before"
                    description="Let fans vote, follow matches, and support their favorite teams with interactive features."
                  />
                </Card>
                <Card>
                  <InfoCard
                    className="p-6"
                    icon={Star}
                    title="Stay Informed with Timely Updates"
                    description="Receive notifications on match results, bracket progress, and score submissions, keeping you up to date."
                  />
                </Card>
              </div>
              <div className="flex justify-end">
                <img src="tournaments.svg" alt="Feature 3" className="left-0" />
              </div>
            </div>
          </section>
          <section className="w-full flex flex-col gap-8">
            <p className="min-w-[45%] text-3xl">How It Works</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
              <InfoCard
                variant="secondary"
                icon={Star}
                title="Dynamic Bracket Management"
                description="Generate and manage tournament brackets effortlessly, ensuring smooth transitions between rounds."
              />
              <InfoCard
                variant="secondary"
                icon={Star}
                title="Comprehensive Match Scheduling"
                description="Schedule and oversee matches with ease, keeping players and teams informed every step of the way."
              />
              <InfoCard
                variant="secondary"
                icon={Star}
                title="Track Progress and Results"
                description="Monitor tournament progress through intuitive brackets and detailed match results for complete clarity."
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
