"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaseItem } from "@/lib/types";
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

export function CaseProcessingClient({ caseItem }: { caseItem: CaseItem }) {
  const router = useRouter();
  const [model, setModel] = useState(caseItem.model);
  const [prompt, setPrompt] = useState(caseItem.prompt);
  const [summary, setSummary] = useState(caseItem.aiSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSummary(
      `Generated with ${model}: This case concerns ${caseItem.title.toLowerCase()} for ${caseItem.client}. The summary should be produced by your backend AI service using the current prompt, case HTML content, and selected model.`
    );
    setIsGenerating(false);
  };

  const saveProcessedResult = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    router.push("/cases");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Case Processing · ${caseItem.id}`}
        description="Three-column layout: original case preview, prompt/model controls, and AI summarization response."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.9fr_1fr]">
        <Panel title="Case Preview" subtitle="Original case content stored as HTML">
          <CasePreview htmlContent={caseItem.htmlContent} />
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
                  <SelectItem value="gpt-4.1">gpt-4.1</SelectItem>
                  <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                  <SelectItem value="claude-3.7-sonnet">claude-3.7-sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Summarization Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[320px] rounded-2xl"
                placeholder="Write the prompt sent to your AI backend..."
              />
            </div>

            <Button className="rounded-2xl" onClick={generateSummary} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Summary"}
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
            <p className="text-xs leading-5 text-slate-500">
              The actual save action should call your backend API to persist the selected model,
              prompt, AI response, and status update.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}