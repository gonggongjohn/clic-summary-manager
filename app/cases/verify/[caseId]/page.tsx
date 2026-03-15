import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CaseVerificationClient } from "@/components/case/case-verification-client";
import { mockCases } from "@/lib/mock-data";

export default function VerifyCasePage({
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
      <CaseVerificationClient caseItem={caseItem} />
    </AppShell>
  );
}