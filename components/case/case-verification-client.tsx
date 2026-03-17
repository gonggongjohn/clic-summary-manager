"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { CasePreview } from "./case-preview";
import { API_BASE_URL } from "@/config/api";

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

export function CaseVerificationClient({ neutralCitation }: { neutralCitation: string }) {
  const neutralCitationDecoded = decodeURIComponent(neutralCitation);
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [generatedSummary, setGeneratedSummary] = useState<string>("");
  const [editedSummary, setEditedSummary] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchCaseContent = async () => {
        if (!neutralCitation) return;
  
        try {
          setIsLoading(true);
          setError(null);
  
          const response = await fetch(`${API_BASE_URL}/case/getContent?neutral_citation=${neutralCitation}`, {credentials: 'include'});
  
          if (!response.ok) {
            throw new Error(`Failed to fetch case: ${response.status} ${response.statusText}`);
          }
  
          const result = await response.json();
  
          if (result.content) {
            setContent(result.content);
          }
  
        } catch (err) {
          console.error("Error fetching case content:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setIsLoading(false);
        }
      };

      const fetchGeneratedSummary = async () => {
        if (!neutralCitation) return;

        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(`${API_BASE_URL}/summary/getGenerated?neutral_citation=${neutralCitation}`, {credentials: 'include'});

          if (!response.ok) {
            throw new Error(`Failed to fetch generated summary from the database: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();

          if (result.summary) {
            setGeneratedSummary(result.summary);
          }

        } catch (err) {
          console.error("Error fetching generated summary content:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setIsLoading(false);
        }
      };

      const fetchLastVerifiedSummary = async () => {
        if (!neutralCitation) return;

        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(`${API_BASE_URL}/summary/getVerified?neutral_citation=${neutralCitation}`, {credentials: 'include'});

          if (!response.ok) {
            throw new Error(`Failed to last verified summary from the database: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();

          if (result.summary) {
            setEditedSummary(result.summary);
          }

        } catch (err) {
          console.error("Error fetching last verified summary content:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchCaseContent();
      fetchGeneratedSummary();
      fetchLastVerifiedSummary();
    }, [neutralCitation]);

  const saveVerifiedSummary = async () => {
    if (!neutralCitation) {
      setError("Missing neutral citation.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/summary/setVerified`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          neutral_citation: neutralCitationDecoded,
          summary_verified: editedSummary
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save result to database: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Error saving result to database:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
    router.push("/cases");
  };

  if (isLoading) {
    return <div className="p-4">Loading case details for {neutralCitationDecoded}...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error:</p>
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-blue-500 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Case Verification · ${neutralCitationDecoded}`}
        description="Review the original case, compare it with the AI summary, and edit the summary before saving."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr_1fr]">
        <Panel title="Original Case" subtitle="Reference view of the original HTML case document">
          <CasePreview htmlContent={content} />
        </Panel>

        <Panel title="AI-generated Summary" subtitle="Reference summary generated by LLM">
          <Textarea value={generatedSummary} readOnly className="min-h-[520px] rounded-2xl bg-slate-50" />
        </Panel>

        <Panel title="Editable Verified Summary" subtitle="Please review the AI-generated summary and input the revised summary.">
          <div className="grid gap-4">
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="min-h-[520px] rounded-2xl"
            />
            <Button className="rounded-2xl" onClick={saveVerifiedSummary} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Verified Summary"}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}