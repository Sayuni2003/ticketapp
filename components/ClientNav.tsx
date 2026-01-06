"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ToggleMode from "./toggleMode";
import MainNavLinks from "./MainNavLinks";
import React from "react";

export default function ClientNav({ session }: { session?: any }) {
  const pathname = usePathname();

  // Hide the nav on the login and logout pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/logout"))
    return null;

  return (
    <div className="flex justify-between">
      <MainNavLinks role={session?.user?.role} />
      <div className="flex items-center gap-2">
        {session ? (
          <Link href="/logout">Logout</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}

        <ToggleMode />
      </div>
    </div>
  );
}
