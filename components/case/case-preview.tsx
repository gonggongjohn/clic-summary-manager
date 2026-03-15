import { ScrollArea } from "@/components/ui/scroll-area";

export function CasePreview({ htmlContent }: { htmlContent: string }) {
  return (
    <ScrollArea className="h-[68vh] rounded-2xl border bg-white p-4">
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </ScrollArea>
  );
}