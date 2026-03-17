import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CaseProcessingClient } from "@/components/case/case-processing-client";

export default async function ProcessCasePage({
  params,
}: {
  params: Promise<{ neutralCitation?: string }>;
}) {
  const { neutralCitation } = await params;

  if (!neutralCitation) {
    notFound();
  }

  return (
    <AppShell>
      <CaseProcessingClient neutralCitation={neutralCitation} />
    </AppShell>
  );
}