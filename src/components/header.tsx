import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MenuIcon, MountainIcon, PhoneIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SheetContent, SheetTrigger, Sheet } from "./ui/sheet";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-6xl items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <img src="logo.svg" alt="Logo" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-12 text-sm font-medium ml-12">
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/vote"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Vote!
          </Link>
        </nav>

        {/* Right side elements */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden items-center gap-2 text-sm font-medium md:flex">
            <Button variant="outline">Login</Button>
            <Button variant="default">Get Started</Button>
          </div>

          {/* Dropdown menu (Search) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Search</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu (Hamburger icon) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
              >
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="grid gap-4 p-4">
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Vote!
                </Link>
                <Button variant="outline">Login</Button>
                <Button variant="default">Get Started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
