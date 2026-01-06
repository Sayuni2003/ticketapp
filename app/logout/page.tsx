"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ redirect: false });
    // Force a full-page navigation so the server picks up the cleared session cookie
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign out</h1>
        <p className="mb-6">Are you sure you want to sign out?</p>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign out"}
          </Button>

          <Link href="/" className="text-sm text-muted-foreground">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
