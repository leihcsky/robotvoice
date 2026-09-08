import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE_NAME} is, how the recipes work, and who this tool is for.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    url: `${siteUrl}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${siteUrl}/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LegalDoc
        title={`About ${BRAND_NAME}`}
        lead="A small online tool that turns written lines into a robot voice you can play and save."
      >
        <section>
          <h2>What this site is</h2>
          <p>
            {SITE_NAME} at robotvoice.org is a web tool for short robot voice
            clips. You type a sentence, pick a locked recipe (Classic, Deep,
            Futuristic, Cute, Villain, or Announcer), and generate a metallic
            mix in the browser. It is built for video voiceover, game NPC
            lines, YouTube bits, and prank clips—not for cloning a real
            person’s voice from a recording.
          </p>
        </section>
        <section>
          <h2>How it differs from generic speech tools</h2>
          <p>
            Each recipe is a preview of the mix you get. Cute and Villain use a
            female source; Classic, Deep, and Futuristic use a male source;
            Announcer is a PA/radio narrator. Dedicated pages exist for a{" "}
            <Link href="/female-robot-voice-generator">
              female robot voice generator
            </Link>{" "}
            and a{" "}
            <Link href="/creepy-robot-voice-generator">
              creepy robot voice generator
            </Link>
            . The homepage keeps the full set.
          </p>
        </section>
        <section>
          <h2>Who it is for</h2>
          <p>
            Makers who need a few robot lines without a studio: editors dropping
            a sting on a timeline, game jammers, and people making a joke clip.
            Scripts stay short on purpose. There is a daily free allowance per
            network so the generator stays usable without turning into an
            unbounded API.
          </p>
        </section>
        <section>
          <h2>Who runs it</h2>
          <p>
            Robot Voice is an independent site focused on this one generator. We
            are not a marketplace of celebrity voices and we do not sell
            recordings of identifiable people. For questions, privacy requests,
            or abuse reports, use the{" "}
            <Link href="/contact">contact page</Link> ({CONTACT_EMAIL}).
          </p>
        </section>
      </LegalDoc>
    </>
  );
}
