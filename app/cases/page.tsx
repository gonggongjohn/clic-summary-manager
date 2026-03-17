import { AppShell } from "@/components/layout/app-shell";
import { CaseManagementClient } from "@/components/case/case-management-client";

export default function CasesPage() {
  return (
    <AppShell>
      <CaseManagementClient />
    </AppShell>
  );
}