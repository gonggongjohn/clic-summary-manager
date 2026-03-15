"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderOpen, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

export function AppSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Next.js Frontend</p>
          <h1 className="text-xl font-semibold">Legal Case Manager</h1>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="mt-1 font-medium">Alex Morgan</p>
        <p className="text-sm text-slate-600">alex@lawfirm.com</p>
      </div>

      <nav className="mt-8 space-y-2">
        <SidebarLink href="/cases" icon={<FolderOpen className="h-4 w-4" />} label="Case Management" />
        <SidebarLink href="/cases/process/CASE-2026-001" icon={<Sparkles className="h-4 w-4" />} label="Case Processing" />
        <SidebarLink href="/cases/verify/CASE-2026-002" icon={<ShieldCheck className="h-4 w-4" />} label="Case Verification" />
      </nav>

      <Separator className="my-6" />

      <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
        <Link href="/login">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </Button>
    </aside>
  );
}