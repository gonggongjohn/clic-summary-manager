"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config/api";

export default function RegisterPage() {
  const router = useRouter();
  
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleRegister = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });
  
        if (!res.ok) {
          alert("Register failed");
          const data = await res.json();
          console.log(data.detail)
          return;
        }
  
        const data = await res.json();
  
        // if backend returns token
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
  
        // redirect
        router.push("/cases");
      } catch (error) {
        console.error(error);
        alert("Network error");
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <Card className="w-full max-w-xl rounded-[28px] border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <p className="text-sm text-slate-500">
            Verification System for Case Summarization Task.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input 
                  id="username"
                  type="text"
                  className="rounded-2xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  className="rounded-2xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleRegister}
              >
                Register
              </Button>

            <p className="text-sm text-slate-500">
              Already have an account? <Link href="/login" className="font-medium underline">Login</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}