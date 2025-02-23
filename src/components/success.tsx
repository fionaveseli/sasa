import { Rocket } from "lucide-react"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SuccessCard({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <Card className="w-full max-w-md p-8" {...props}>
            <CardHeader className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-4">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                    >
                        <path d="M59.8 20.2002L55 25.0002" stroke="#BAFF26" strokeWidth="3" strokeLinecap="round" />
                        <path
                            d="M13.3333 40L10 43.3333"
                            stroke="#BAFF26"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M40.0001 66.667L36.6667 70.0003"
                            stroke="#BAFF26"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M26.6667 33.8893L40.4108 20.1451C44.1604 16.3956 46.0351 14.5208 48.1041 13.0108C52.3491 9.91266 57.2727 7.87323 62.4651 7.06226C64.9961 6.66699 67.6474 6.66699 72.9501 6.66699C73.2271 6.66699 73.3334 6.79406 73.3334 7.05046C73.3334 12.3531 73.3334 15.0045 72.9381 17.5352C72.1271 22.7276 70.0878 27.6512 66.9898 31.8963C65.4798 33.9653 63.6048 35.84 59.8554 39.5897L46.1111 53.3337"
                            stroke="#4F1787"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M34.4701 26.9949C28.7937 26.9949 21.6593 25.7925 16.3477 27.9926C12.4558 29.6047 9.59188 33.3377 6.66675 36.2627L17.6866 40.9853C20.607 42.237 18.8218 45.9223 18.3383 48.3397C17.7996 51.0333 17.8296 51.1327 19.772 53.075L26.9253 60.2283C28.8677 62.1707 28.967 62.201 31.6606 61.662C34.0781 61.1787 37.7634 59.3933 39.0147 62.3137L43.7377 73.3337C46.6627 70.4087 50.3957 67.5447 52.0077 63.6527C54.2081 58.341 53.0054 51.2067 53.0054 45.5303"
                            stroke="#4F1787"
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M50 13.5996C54 14.1996 58.2 15.7996 60.538 18.1996C63.5253 20.8401 65.6 24.3996 66.4 29.9996"
                            stroke="#4F1787"
                            strokeWidth="3"
                            strokeLinecap="square"
                        />
                    </svg>
                    <h1 className="text-3xl tracking-tight">Welcome, Jane Smith!</h1>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="font-extralight text-m">
                    Your account has been created successfully. You&apos;re all ready to proceed using{" "}
                    <span className="font-medium text-primary">sasa</span>.
                </p>
            </CardContent>
            <CardFooter>
                <Link href="/dashboard" className="w-full">
                    <Button type="submit" variant={"submit"} className="w-full">
                        Continue
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

