"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-40 border-b bg-gradient-to-r from-blue-100 via-white to-green-100">
      {/* Enhanced Astro Logo */}
      <Link href="/">
        <div className="flex items-center space-x-2">
          <Star className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Astro
          </h1>
        </div>
      </Link>

      {/* Normal Navigation (Hidden on Small Screens) */}
      <nav className="hidden md:flex space-x-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/create-resume">Create</NavLink>
      </nav>

      {/* Mobile Navigation (Hidden on Large Screens) */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </header>
  );
}

// Navigation Link Component (Re-usable)
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={clsx(
        "text-lg font-medium px-3 py-1 rounded transition",
        isActive
          ? "md:bg-gray-200 text-blue-600 font-semibold"
          : "hover:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
}

// Mobile Navigation (Hamburger Menu)
function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-gradient-to-r from-blue-100 via-white to-green-100"
      >
        <SheetHeader className="text-2xl font-bold">Menu</SheetHeader>
        <nav className="flex flex-col space-y-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/create-resume">Create</NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
