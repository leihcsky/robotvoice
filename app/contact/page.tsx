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
  title: "Contact",
  description: `Email ${CONTACT_EMAIL} for questions, privacy requests, or abuse reports about ${SITE_NAME}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SITE_NAME}`,
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${siteUrl}/`,
      email: CONTACT_EMAIL,
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
        title="Contact"
        lead={`The fastest way to reach ${BRAND_NAME} is email. We read it; we do not run a phone line.`}
      >
        <section>
          <h2>Email</h2>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>
            We aim to reply within a few business days. If your message is a
            privacy or takedown request, say so in the subject line so we can
            treat it first.
          </p>
        </section>
        <section>
          <h2>What to include</h2>
          <ul>
            <li>A short description of the issue or question.</li>
            <li>
              For a generated clip: the approximate time, the recipe you used,
              and whether you can share the script.
            </li>
            <li>
              For privacy requests: the email or other detail we should look
              up, and what you want us to do (access, correction, or deletion).
            </li>
          </ul>
        </section>
        <section>
          <h2>We can help with</h2>
          <p>
            Product questions, broken generations, policy questions, and reports
            that someone used the tool for impersonation or other abuse. Legal
            terms live on the <Link href="/terms">terms of use</Link> page;
            data practices live on the{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>
        </section>
      </LegalDoc>
    </>
  );
}
