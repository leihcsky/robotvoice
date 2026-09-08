import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS, PRESET_IDS } from "@/lib/audio/presets";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  HOME_USE_CASES,
  HOME_USE_CASES_HEADING,
  HOME_USE_CASES_INTRO,
  HOME_RECIPE_JOBS,
  HOW_IT_WORKS,
  SITE_NAME,
  buildHomeJsonLd,
  getSiteUrl,
} from "@/lib/seo";
import { HomeFaq } from "@/components/home-faq";
import { RobotEditor } from "@/components/robot-editor";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  const jsonLd = buildHomeJsonLd(getSiteUrl());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="mb-5 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          {SITE_NAME}
        </h1>
        <p className="mt-1.5 text-muted">
          Free robot voice generator. Type a script, pick a mix, and generate a
          robot voice for a video, a game line, or a prank.
        </p>
      </header>

      <section aria-labelledby="generator-heading">
        <h2 id="generator-heading" className="sr-only">
          Generate a robot voice from text
        </h2>
        <RobotEditor />
      </section>

      <div className="mt-16 space-y-14">
      <section aria-labelledby="how-heading" className="space-y-4">
        <h2 id="how-heading" className="text-2xl font-semibold tracking-tight">
          How this robot voice generator works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
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
          {HOME_USE_CASES_HEADING}
        </h2>
        <p className="text-muted">{HOME_USE_CASES_INTRO}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {HOME_USE_CASES.map((item) => (
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
          Female, creepy, and classic robot voices
        </h2>
        <p className="text-muted">
          Mixes below are only so the file matches the scene you already have.
          Each sample is the sound Generate uses unless you open tweaks. The{" "}
          <Link
            href="/female-robot-voice-generator"
            className="text-accent hover:underline"
          >
            female robot voice generator
          </Link>{" "}
          is for assistants and androids; the{" "}
          <Link
            href="/creepy-robot-voice-generator"
            className="text-accent hover:underline"
          >
            creepy robot voice generator
          </Link>{" "}
          is for horror and antagonist AI. Classic, Deep, and Futuristic are
          male-source; Announcer is PA/radio.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRESET_IDS.map((id) => {
            const recipe = PRESETS[id];
            const href =
              id === "cute-robot"
                ? "/female-robot-voice-generator"
                : id === "villain-robot"
                  ? "/creepy-robot-voice-generator"
                  : null;
            return (
              <li
                key={id}
                className="rounded-2xl border border-line bg-panel p-5"
              >
                <h3 className="text-sm font-medium">{recipe.label} robot voice</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {recipe.description}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {HOME_RECIPE_JOBS[id]}
                </p>
                {href ? (
                  <Link
                    href={href}
                    className="mt-3 inline-block text-sm text-accent hover:underline"
                  >
                    {id === "cute-robot"
                      ? "Open female robot voice generator"
                      : "Open creepy robot voice generator"}
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <HomeFaq />
      </div>
    </div>
  );
}
