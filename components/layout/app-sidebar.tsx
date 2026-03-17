"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderOpen, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL } from "@/config/api";

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
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/user/me`, {credentials: 'include'});

        if (!response.ok) {
          throw new Error(`Failed to fetch user info`);
        }

        const result = await response.json();

        setUsername(result.user.username);
        setEmail(result.user.email);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
    router.refresh();
  };

  if (isLoading) {
    return <div className="p-4">Loading user info...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error:</p>
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-blue-500 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <aside className="border-r border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">CLIC-Chat</p>
          <h1 className="text-xl font-semibold">Case Management System</h1>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="mt-1 font-medium">{username}</p>
        <p className="text-sm text-slate-600">{email}</p>
      </div>

      <nav className="mt-8 space-y-2">
        <SidebarLink href="/cases" icon={<FolderOpen className="h-4 w-4" />} label="Case Management" />
        <SidebarLink href="/cases/process" icon={<Sparkles className="h-4 w-4" />} label="Case Processing" />
        <SidebarLink href="/cases/verify" icon={<ShieldCheck className="h-4 w-4" />} label="Case Verification" />
      </nav>

      <Separator className="my-6" />

      <Button variant="outline" className="w-full justify-start rounded-2xl" onClick={handleLogout}>
        <LogOut />
        Logout
      </Button>
    </aside>
  );
}