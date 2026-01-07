"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("password", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "CredentialsSignin")
        setError("Invalid username or password");
      else setError(res.error);
      return;
    }

    window.location.href = "/";
  }

  function fillCredentials(role: "admin" | "user" | "tech") {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else if (role === "user") {
      setUsername("Sayuni");
      setPassword("user@123");
    } else {
      setUsername("Kavindu");
      setPassword("user@123");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl shadow-lg p-8 bg-background">
        <h1 className="text-2xl font-bold text-center mb-2">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Demo Accounts Section */}
        <div className="mt-6 border rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">
            Demo Accounts (For Reviewers)
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">Admin</p>
              <Button size="sm" onClick={() => fillCredentials("admin")}>
                Use
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm">User</p>
              <Button size="sm" onClick={() => fillCredentials("user")}>
                Use
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm">Tech</p>
              <Button size="sm" onClick={() => fillCredentials("tech")}>
                Use
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
