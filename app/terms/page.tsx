import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";
import { BRAND_DOMAIN, CONTACT_EMAIL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Rules for using ${SITE_NAME}, including generated audio, acceptable use, and limits.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Use"
      lead={`These terms apply when you use ${SITE_NAME} at ${BRAND_DOMAIN}.`}
    >
      <section>
        <h2>The service</h2>
        <p>
          Robot Voice provides an online generator that turns text you type into
          a synthetic robot-style voice clip. Recipes, previews, and optional
          tweaks are part of that tool. The service is provided as-is, with a
          daily free allowance and a per-clip character cap so costs stay
          bounded.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>
          You must be old enough to use an online tool in your country. If you
          use the generator for an organization, you confirm you have authority
          to accept these terms for it.
        </p>
      </section>

      <section>
        <h2>Your script</h2>
        <p>
          You keep whatever rights you already have in the words you type. You
          grant us a limited license to send that text to our speech provider,
          process it, store it as needed to run the job, and return audio to
          you. Do not submit text you are not allowed to use.
        </p>
      </section>

      <section>
        <h2>Generated audio</h2>
        <p>
          Clips are machine-generated. They are not a recording of a specific
          human performer and are not a voice clone of a real person from an
          upload. Subject to these terms and the law, you may use a clip you
          generate for a video, game, or similar project. We do not promise
          that a clip is unique, fit for a particular purpose, or free of
          third-party claims.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You may not use the generator to:</p>
        <ul>
          <li>Impersonate a real person in a way meant to deceive.</li>
          <li>
            Commit fraud, scams, harassment, or other illegal activity.
          </li>
          <li>
            Bypass rate limits, scrape the API, or overload the service.
          </li>
          <li>
            Generate sexual content involving minors or other illegal content.
          </li>
        </ul>
        <p>
          We may refuse or rate-limit requests, delete stored files, or block
          access when we believe these rules are broken.
        </p>
      </section>

      <section>
        <h2>Limits and availability</h2>
        <p>
          Free use is capped per network and per clip. Features such as
          accounts, history, and paid credits may appear later; until then the
          public generator is the product. We may change recipes, providers, or
          limits, or suspend the service for maintenance or abuse.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          The site is provided “as is” without warranties of any kind, including
          uninterrupted access or error-free audio. To the extent the law
          allows, we are not liable for indirect, incidental, or consequential
          damages, or for how you use a generated clip.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If we update these terms, we will change the date at the top of this
          page. Continued use after an update means you accept the new terms.
          Privacy details are on the{" "}
          <Link href="/privacy">privacy policy</Link>. Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or the{" "}
          <Link href="/contact">contact</Link> page.
        </p>
      </section>
    </LegalDoc>
  );
}
