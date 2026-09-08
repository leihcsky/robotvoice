import Link from "next/link";
import type { Metadata } from "next";
import { RobotEditor } from "@/components/robot-editor";
import { PageFaq } from "@/components/page-faq";
import type { BranchPageContent } from "@/lib/seo/pages";
import { buildBranchJsonLd } from "@/lib/seo/pages";

export function branchMetadata(page: BranchPageContent): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export function BranchLanding({ page }: { page: BranchPageContent }) {
  const jsonLd = buildBranchJsonLd(page);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="mb-5 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{page.h1}</h1>
        <p className="mt-1.5 text-muted">{page.lead}</p>
      </header>

      <section aria-labelledby="generator-heading">
        <h2 id="generator-heading" className="sr-only">
          Type a script and generate
        </h2>
        <RobotEditor
          defaultPreset={page.defaultPreset}
          presetIds={page.presetIds}
          defaultText={page.defaultText}
          pickerNote={
            <>
              {page.fullSetHint}{" "}
              <Link href="/" className="text-accent hover:underline">
                Open the full robot voice generator
              </Link>
              .
            </>
          }
        />
      </section>

      <div className="mt-16 space-y-14">
        <section aria-labelledby="how-heading" className="space-y-4">
          <h2 id="how-heading" className="text-2xl font-semibold tracking-tight">
            {page.howHeading}
          </h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {page.howSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-line bg-panel p-5"
              >
                <p className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="use-heading" className="space-y-4">
          <h2 id="use-heading" className="text-2xl font-semibold tracking-tight">
            {page.useCasesHeading}
          </h2>
          <p className="text-muted">{page.useCasesIntro}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.useCases.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-panel p-5"
              >
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="recipes-heading" className="space-y-4">
          <h2
            id="recipes-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            {page.recipesHeading}
          </h2>
          <p className="text-muted">{page.recipesBody}</p>
        </section>

        <PageFaq
          heading={page.faqHeading}
          intro={page.faqIntro}
          faqs={page.faqs}
        />

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/" className="text-accent hover:underline">
            All robot voices
          </Link>
          <Link href={page.siblingHref} className="text-accent hover:underline">
            {page.siblingLabel}
          </Link>
        </nav>
      </div>
    </div>
  );
}
