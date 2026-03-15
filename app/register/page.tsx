"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <Card className="w-full max-w-xl rounded-[28px] border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <p className="text-sm text-slate-500">
            Create an account and connect this form to your backend registration endpoint.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue="Alex Morgan" className="rounded-2xl" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alex@lawfirm.com" className="rounded-2xl" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password123" className="rounded-2xl" />
            </div>

            <Button className="mt-2 rounded-2xl" asChild>
              <Link href="/cases">Create account</Link>
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