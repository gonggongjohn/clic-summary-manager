import { CaseItem } from "./types";

export const mockCases: CaseItem[] = [
  {
    id: "CASE-2026-001",
    title: "Breach of Contract Claim",
    client: "Northshore Logistics",
    matterNumber: "MAT-1001",
    updatedAt: "2026-03-10 14:20",
    status: "raw",
    model: "gpt-4.1",
    prompt:
      "Summarize the legal dispute, identify the parties, list the key facts chronologically, and highlight the major claims and requested relief.",
    htmlContent: `
      <article>
        <h1>Breach of Contract Complaint</h1>
        <p><strong>Plaintiff:</strong> Northshore Logistics, LLC</p>
        <p><strong>Defendant:</strong> Apex Freight Solutions, Inc.</p>
        <p>On January 12, 2026, the parties entered into a transportation services agreement. Plaintiff alleges Defendant failed to deliver time-sensitive shipments and repeatedly invoiced for services not completed.</p>
        <p>The complaint seeks compensatory damages, attorneys' fees, and injunctive relief to prevent further misuse of Plaintiff's customer data.</p>
      </article>
    `,
    aiSummary:
      "Northshore Logistics alleges Apex Freight Solutions breached a transportation services agreement by missing deliveries and billing for incomplete services. The complaint seeks damages, legal fees, and injunctive relief.",
  },
  {
    id: "CASE-2026-002",
    title: "Employment Discrimination Review",
    client: "Jane Doe",
    matterNumber: "MAT-1002",
    updatedAt: "2026-03-11 09:05",
    status: "ai_processed",
    model: "gpt-4o-mini",
    prompt:
      "Create a concise employment-law summary with the timeline of events, alleged discriminatory acts, witness references, and procedural posture.",
    htmlContent: `
      <article>
        <h1>Administrative Charge Narrative</h1>
        <p>The employee alleges repeated denial of promotion from June 2024 to November 2025, despite positive performance reviews.</p>
        <p>The filing states that similarly situated employees outside the protected class were promoted sooner and received higher compensation.</p>
        <p>An EEOC charge was filed before the present civil complaint was drafted.</p>
      </article>
    `,
    aiSummary:
      "The matter concerns alleged employment discrimination involving denied promotions, unequal compensation, and an EEOC filing preceding civil litigation. The narrative emphasizes comparative treatment of similarly situated employees and a timeline running from mid-2024 through late-2025.",
  },
  {
    id: "CASE-2026-003",
    title: "Personal Injury Demand",
    client: "Michael Carter",
    matterNumber: "MAT-1003",
    updatedAt: "2026-03-12 16:40",
    status: "verified",
    model: "claude-3.7-sonnet",
    prompt:
      "Summarize liability, injuries, medical treatment, and damages in plain but legally precise language.",
    htmlContent: `
      <article>
        <h1>Demand Package Summary</h1>
        <p>Claimant was rear-ended at a stoplight on September 4, 2025. Liability is asserted against the insured driver for inattentive driving.</p>
        <p>Medical records reflect cervical strain, physical therapy, and temporary work limitations for eight weeks.</p>
        <p>The demand requests settlement for medical expenses, lost wages, and pain and suffering.</p>
      </article>
    `,
    aiSummary:
      "The claimant seeks recovery arising from a rear-end collision allegedly caused by inattentive driving. The claimed damages include medical costs, lost income during temporary work restrictions, and non-economic damages for pain and suffering.",
  },
];