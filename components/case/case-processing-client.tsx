"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function CaseProcessingClient({ neutralCitation }: { neutralCitation: string }) {
  const neutralCitationDecoded = decodeURIComponent(neutralCitation);
  const router = useRouter();

  const [model, setModel] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [caseName, setCaseName] = useState<string>("");
  
  const [isGenerating, setIsGenerating] = useState(false);
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

    const fetchLastResult = async () => {
      if (!neutralCitation) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/summary/getGenerated?neutral_citation=${neutralCitation}`, {credentials: 'include'});

        if (!response.ok) {
          throw new Error(`Failed to fetch last prompt and summary from the database: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.prompt) {
          setPrompt(result.prompt);
        }
        if (result.summary) {
          setSummary(result.summary);
        }

      } catch (err) {
        console.error("Error fetching last summary content:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseContent();
    fetchLastResult();
  }, [neutralCitation]);

  const generateSummary = async () => {
    if (!neutralCitation) {
      setError("Missing neutral citation.");
      return;
    }

    if (!model) {
      setError("Please select a model.");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a summarization prompt.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/case/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          neutral_citation:  neutralCitationDecoded,
          model,
          summary_prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate summary: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.summary) {
        throw new Error("Backend response did not include a summary.");
      }

      setSummary(result.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProcessedResult = async () => {
    if (!neutralCitation) {
      setError("Missing neutral citation.");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a summarization prompt.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/summary/setGenerated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          neutral_citation:  neutralCitationDecoded,
          summary_prompt: prompt,
          summary_generated: summary
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

  if (error && !isGenerating) {
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
        title={`Case Processing · ${ neutralCitationDecoded}`}
        description="Prompt large language models to get the summarization of the legal case."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.9fr_1fr]">
        <Panel title="Case Preview" subtitle="Original case content">
          <CasePreview htmlContent={content} />
        </Panel>

        <Panel title="Prompt & Model" subtitle="Configure AI summarization request">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5.4">gpt-5.4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Summarization Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[320px] rounded-2xl"
                placeholder="Configure the summarization prompt that should be used for this case..."
              />
            </div>

            <Button className="rounded-2xl" onClick={generateSummary} disabled={isGenerating}>
              {isGenerating ? "Generating...(It may takes a few minutes to get the response)" : "Generate Summary"}
            </Button>
          </div>
        </Panel>

        <Panel title="AI Summary Response" subtitle="Preview the generated summarization before saving">
          <div className="grid h-full gap-4">
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[420px] rounded-2xl"
              placeholder="AI response will appear here..."
            />
            <Button className="rounded-2xl" onClick={saveProcessedResult} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Result to Database"}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}