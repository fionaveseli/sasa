import Link from "next/link";
import { MountainIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-foreground text-white py-10 h-[325px]">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4 md:px-6 h-full">
        <div className="flex flex-col items-start gap-4 md:gap-8 w-full md:w-3/5">
          <Link href="#" className="flex items-center gap-2">
            <img src="logo1.svg" alt="Logo" className="w-32" />
          </Link>
          <p className="text-sm text-gray-400">
            Your partner in building amazing experiences for users.
          </p>
        </div>

        <div className="flex w-full md:w-2/5 gap-8 md:gap-4 justify-between">
          <div className="flex flex-col justify-center gap-2 w-full md:w-1/3">
            <h3 className="font-semibold">Company</h3>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Press
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-2 w-full md:w-1/3">
            <h3 className="font-semibold">Services</h3>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Web Development
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Mobile Development
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Consulting
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-2 w-full md:w-1/3">
            <h3 className="font-semibold">Support</h3>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Help Center
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-sm text-gray-400">Copyright</p>
      </div>
    </footer>
  );
}
