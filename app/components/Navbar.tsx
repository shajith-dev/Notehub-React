"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const removeUser = useAuthStore((state) => state.removeUser);
  const removeToken = useAuthStore((state) => state.removeToken);
  const router = useRouter();

  // Fix hydration mismatch by only rendering user-dependent content after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  function handleSignOut() {
    removeUser();
    removeToken();
    // router.push("/");
  }

  // Render a loading state or simplified navbar until client-side hydration is complete
  if (!mounted) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-accent">NoteHub</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-accent">
                NoteHub
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/upload"
                  className="border-transparent text-gray-500 hover:border-accent hover:text-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Upload
                </Link>
                <Link
                  href="/request"
                  className="border-transparent text-gray-500 hover:border-accent hover:text-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Requests
                </Link>
                <Link
                  href="/search"
                  className="border-transparent text-gray-500 hover:border-accent hover:text-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Search
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user !== null ? (
              <div className="text-gray-500 hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar>
                        <AvatarFallback>
                          {user.userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-gray-500 hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-accent text-white hover:bg-accent/90 px-3 py-2 rounded-md text-sm font-medium ml-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          {user ? (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/upload"
                className="text-gray-500 hover:bg-accent hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Upload
              </Link>
              <Link
                href="/request"
                className="text-gray-500 hover:bg-accent hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Requests
              </Link>
              <Link
                href="/search"
                className="text-gray-500 hover:bg-accent hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Search
              </Link>
              <Link
                href="/profile"
                className="text-gray-500 hover:bg-accent hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:bg-accent hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/signin"
                className="text-gray-500 hover:bg-accent hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-accent text-white hover:bg-accent/90 block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
