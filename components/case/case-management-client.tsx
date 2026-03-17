"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CaseItem, CaseStatus } from "@/lib/types";
import { statusLabel, statusStyles, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FolderOpen, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { API_BASE_URL } from "@/config/api";

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[24px]">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      </CardContent>
    </Card>
  );
}

export function CaseManagementClient() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const filteredCases = useMemo(() => {
    if (filter === "all") return cases;
    return cases.filter((item) => item.status === filter);
  }, [cases, filter]);

  useEffect(() => {
    async function fetchCases() {
      try {
        const response = await fetch(`${API_BASE_URL}/case/list?N=20`, {credentials: 'include'});
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cases: ${response.status}`);
        }

        const data = await response.json();
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  const counts = useMemo(
    () => ({
      all: cases.length,
      raw: cases.filter((c) => c.status === "raw").length,
      summarized: cases.filter((c) => c.status === "summarized").length,
      verified: cases.filter((c) => c.status === "verified").length,
    }),
    [cases]
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-slate-500">Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-medium">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Dashboard"
        description="Overview of all cases for CLIC-Chat."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="All Cases" value={counts.all} icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Raw" value={counts.raw} icon={<FolderOpen className="h-5 w-5" />} />
        <StatsCard title="Summarized" value={counts.summarized} icon={<Sparkles className="h-5 w-5" />} />
        <StatsCard title="Verified" value={counts.verified} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <Card className="rounded-[24px]">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Case List</CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as CaseStatus | "all") }>
            <TabsList className="grid grid-cols-4 rounded-2xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              <TabsTrigger value="summarized">Summarized</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3 pr-4 font-medium">Neutral Citation</th>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((item) => (
                  <tr key={item.neutral_citation} className="border-b last:border-0">
                    <td className="py-4 pr-4 font-medium">{item.neutral_citation}</td>
                    <td className="py-4 pr-4">{item.name}</td>
                    <td className="py-4 pr-4">
                      <Badge className={cn("rounded-full", statusStyles[item.status])}>
                        {statusLabel[item.status]}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => router.push(`/cases/process/${encodeURIComponent(item.neutral_citation)}`)}
                        >
                          Process
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl"
                          onClick={() => router.push(`/cases/verify/${encodeURIComponent(item.neutral_citation)}`)}
                        >
                          Verify
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
  );
}