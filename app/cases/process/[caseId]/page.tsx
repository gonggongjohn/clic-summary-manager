import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CaseProcessingClient } from "@/components/case/case-processing-client";
import { mockCases } from "@/lib/mock-data";

export default function ProcessCasePage({
  params,
}: {
  params: { caseId: string };
}) {
  const caseItem = mockCases.find((item) => item.id === params.caseId);

  if (!caseItem) {
    notFound();
  }

  return (
    <AppShell>
      <CaseProcessingClient caseItem={caseItem} />
    </AppShell>
  );
}