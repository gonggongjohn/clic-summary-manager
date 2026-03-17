import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CaseVerificationClient } from "@/components/case/case-verification-client";

export default async function VerifyCasePage({
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
      <CaseVerificationClient neutralCitation={neutralCitation} />
    </AppShell>
  );
}