"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode, useActionState, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { logOut } from "../../../lib/actions";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Posts", href: "/dashboard/posts" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(async () => {
      await logOut();
      window.location.href = "/";
  }, undefined);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Mobile & Desktop) */}
      <aside
        className={cn(
          "fixed md:relative top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 text-xl font-bold">
            Astro
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white"
            >
              <X size={24} />
            </button>
          </div>
          {/* Sidebar Navigation */}
          <nav className="p-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={cn(
                    "p-3 rounded-md hover:bg-gray-700 transition my-1",
                    pathname === item.href && "bg-gray-700"
                  )}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-5">
          <AlertDialog>
            <AlertDialogTrigger className="w-full p-3 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer">
              Log out
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <form action={formAction}>
                  <AlertDialogAction className="cursor-pointer" type="submit">
                    {/* <button type="submit" disabled={isPending} className=" cursor-pointer"> */}
                    {isPending ? "Loading..." : "Log Out"}
                    {/* </button> */}
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">{children}</main>
    </div>
  );
}
