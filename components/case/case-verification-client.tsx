"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaseItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { CasePreview } from "./case-preview";

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-[24px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function CaseVerificationClient({ caseItem }: { caseItem: CaseItem }) {
  const router = useRouter();
  const [editedSummary, setEditedSummary] = useState(caseItem.aiSummary);
  const [isSaving, setIsSaving] = useState(false);

  const saveVerifiedSummary = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    router.push("/cases");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Case Verification · ${caseItem.id}`}
        description="Review the original case, compare it with the AI summary, and edit the summary before saving."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr_1fr]">
        <Panel title="Original Case" subtitle="Reference view of the original HTML case document">
          <CasePreview htmlContent={caseItem.htmlContent} />
        </Panel>

        <Panel title="Original AI Summary" subtitle="Read-only reference generated during the processing stage">
          <Textarea value={caseItem.aiSummary} readOnly className="min-h-[520px] rounded-2xl bg-slate-50" />
        </Panel>

        <Panel title="Editable Verified Summary" subtitle="Start from the AI summary and refine it before saving">
          <div className="grid gap-4">
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="min-h-[520px] rounded-2xl"
            />
            <Button className="rounded-2xl" onClick={saveVerifiedSummary} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Edited Summary"}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}