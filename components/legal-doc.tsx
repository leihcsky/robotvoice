import { LEGAL_UPDATED } from "@/lib/seo";

export function LegalDoc({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {lead ? <p className="mt-2 text-muted">{lead}</p> : null}
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        Last updated {LEGAL_UPDATED}
      </p>
      <div className="mt-10 space-y-8 text-[0.95rem] leading-7 text-muted [&_a]:text-accent [&_a]:hover:underline [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
