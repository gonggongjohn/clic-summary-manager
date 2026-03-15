"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CaseItem, CaseStatus } from "@/lib/types";
import { statusLabel, statusStyles, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FolderOpen, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

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

export function CaseManagementClient({ cases }: { cases: CaseItem[] }) {
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const router = useRouter();

  const filteredCases = useMemo(() => {
    if (filter === "all") return cases;
    return cases.filter((item) => item.status === filter);
  }, [cases, filter]);

  const counts = useMemo(
    () => ({
      all: cases.length,
      raw: cases.filter((c) => c.status === "raw").length,
      ai_processed: cases.filter((c) => c.status === "ai_processed").length,
      verified: cases.filter((c) => c.status === "verified").length,
    }),
    [cases]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Management"
        description="Cases are categorized as Raw, AI Processed, and Verified. Replace mock data with database queries from your backend."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="All Cases" value={counts.all} icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Raw" value={counts.raw} icon={<FolderOpen className="h-5 w-5" />} />
        <StatsCard title="AI Processed" value={counts.ai_processed} icon={<Sparkles className="h-5 w-5" />} />
        <StatsCard title="Verified" value={counts.verified} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <Card className="rounded-[24px]">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Case List</CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as CaseStatus | "all") }>
            <TabsList className="grid grid-cols-4 rounded-2xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              <TabsTrigger value="ai_processed">AI</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3 pr-4 font-medium">Case ID</th>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Client</th>
                  <th className="py-3 pr-4 font-medium">Matter #</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Updated</th>
                  <th className="py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-4 pr-4 font-medium">{item.id}</td>
                    <td className="py-4 pr-4">{item.title}</td>
                    <td className="py-4 pr-4">{item.client}</td>
                    <td className="py-4 pr-4">{item.matterNumber}</td>
                    <td className="py-4 pr-4">
                      <Badge className={cn("rounded-full", statusStyles[item.status])}>
                        {statusLabel[item.status]}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{item.updatedAt}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => router.push(`/cases/process/${item.id}`)}
                        >
                          Process
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl"
                          onClick={() => router.push(`/cases/verify/${item.id}`)}
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