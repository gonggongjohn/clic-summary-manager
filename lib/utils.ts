import { API_BASE_URL } from "@/config/api";
import { CaseStatus } from "./types";
import { NextRequest } from "next/server";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const statusStyles: Record<CaseStatus, string> = {
  raw: "bg-slate-100 text-slate-700",
  summarized: "bg-amber-100 text-amber-700",
  verified: "bg-emerald-100 text-emerald-700",
};

export const statusLabel: Record<CaseStatus, string> = {
  raw: "Raw",
  summarized: "Summarized",
  verified: "Verified",
};

export async function getCurrentUser(request: NextRequest) {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.user;
}