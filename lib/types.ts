export type CaseStatus = "raw" | "summarized" | "verified";

export type CaseItem = {
  neutral_citation: string;
  name: string;
  status: CaseStatus;
  model: string;
  prompt: string;
  content: string;
  generatedSummary: string;
  verifiedSummary: string;
};

export type User = {
  name: string;
  email: string;
};