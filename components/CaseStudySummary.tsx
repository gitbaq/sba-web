import { CaseStudy } from "@/lib/work";

const CELLS: { key: keyof Pick<CaseStudy, "role" | "timeline" | "stack" | "result">; label: string }[] =
  [
    { key: "role", label: "Role" },
    { key: "timeline", label: "Timeline" },
    { key: "stack", label: "Stack" },
    { key: "result", label: "Result" },
  ];

export default function CaseStudySummary({ study }: { study: CaseStudy }) {
  return (
    <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border bg-secondary/30 p-4 md:p-5'>
      {CELLS.map(({ key, label }) => {
        const value =
          key === "stack" ? study.stack.slice(0, 4).join(", ") : study[key];
        return (
          <div key={key} className='flex flex-col gap-1'>
            <dt className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {label}
            </dt>
            <dd className='text-sm text-foreground leading-relaxed'>{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
