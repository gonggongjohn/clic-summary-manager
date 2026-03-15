export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="max-w-3xl text-sm text-slate-600">{description}</p>
    </div>
  );
}