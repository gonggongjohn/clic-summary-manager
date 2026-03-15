"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <Card className="hidden rounded-[28px] border-0 bg-slate-900 text-white shadow-2xl lg:block">
          <CardContent className="flex h-full flex-col justify-between p-10">
            <div>
              <div className="inline-flex rounded-2xl bg-white/10 p-3">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">
                Manage legal cases from intake to AI processing and human verification.
              </h2>
              <p className="mt-4 max-w-xl text-base text-slate-300">
                This frontend demonstrates authentication, status-based case management,
                AI summarization workflow, and verification-ready editing screens.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard title="Raw Intake" description="Track newly ingested case files awaiting AI processing." />
              <FeatureCard title="AI Processed" description="Review model, prompt, and generated summary output." />
              <FeatureCard title="Verified" description="Finalize edited summaries before saving through backend APIs." />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <p className="text-sm text-slate-500">
              Connect this form to your backend authentication endpoint.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@lawfirm.com" className="rounded-2xl" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password123" className="rounded-2xl" />
              </div>

              <Button className="mt-2 rounded-2xl" asChild>
                <Link href="/cases">Login</Link>
              </Button>

              <p className="text-sm text-slate-500">
                Need an account? <Link href="/register" className="font-medium underline">Register</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}