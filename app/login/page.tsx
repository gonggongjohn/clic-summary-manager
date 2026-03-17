"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.detail || "Login failed");
      return;
    }

    // if (data.session_id) {
    //   document.cookie = `session_id=${data.session_id}; path=/; Secure; SameSite=None`;
    // }

      router.push("/cases");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
        <Card className="w-full max-w-xl rounded-[28px] border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <p className="text-sm text-slate-500">
              Verification System for Case Summarization Task.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  type="text"
                  className="rounded-2xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="rounded-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              </div>

              <Button
                className="mt-2 rounded-2xl"
                onClick={handleLogin}
                disabled={loading}
              >
                Login
              </Button>

              <p className="text-sm text-slate-500">
                Need an account? <Link href="/register" className="font-medium underline">Register</Link>
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}