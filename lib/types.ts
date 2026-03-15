export type CaseStatus = "raw" | "ai_processed" | "verified";

export type CaseItem = {
  id: string;
  title: string;
  client: string;
  matterNumber: string;
  updatedAt: string;
  status: CaseStatus;
  model: string;
  prompt: string;
  htmlContent: string;
  aiSummary: string;
};

export type User = {
  name: string;
  email: string;
};