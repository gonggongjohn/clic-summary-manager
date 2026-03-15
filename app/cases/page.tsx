import { AppShell } from "@/components/layout/app-shell";
import { CaseManagementClient } from "@/components/case/case-management-client";
import { mockCases } from "@/lib/mock-data";

export default function CasesPage() {
  return (
    <AppShell>
      <CaseManagementClient cases={mockCases} />
    </AppShell>
  );
}