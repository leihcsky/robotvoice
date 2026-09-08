import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";
import { BRAND_DOMAIN, CONTACT_EMAIL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects and uses scripts, audio, cookies, and IP-based rate limits.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      lead={`This policy describes how ${SITE_NAME} (${BRAND_DOMAIN}) handles information when you use the generator.`}
    >
      <section>
        <h2>Who we are</h2>
        <p>
          Robot Voice operates {BRAND_DOMAIN}. For privacy questions or requests,
          email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. This page is
          the notice for the website and the generator. It is not legal advice.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong className="text-foreground">Scripts you type.</strong> The
            text you submit is sent to our servers so we can generate audio. We
            store the text with the generation record so the job can run and so
            we can debug failures.
          </li>
          <li>
            <strong className="text-foreground">Generated audio.</strong> Output
            files are stored with our object storage provider (Cloudflare R2)
            and delivered through a download URL.
          </li>
          <li>
            <strong className="text-foreground">Technical data for limits.</strong>{" "}
            To stop unbounded TTS use we read your IP address from the request,
            hash it, and count generations per UTC day. We store the hash and
            the count, not the raw IP, in a daily usage table.
          </li>
          <li>
            <strong className="text-foreground">Cookies.</strong> If guest or
            account features are on, we may set a first-party session or guest
            cookie so we can tell requests apart. See Cookies below.
          </li>
          <li>
            <strong className="text-foreground">Account data (when login is
            enabled).</strong>{" "}
            Email and a credit or plan balance if you create an account. Login
            is not required for the current free generator.
          </li>
        </ul>
        <p>
          We do not ask for a microphone recording, precise GPS, payment card
          numbers on this site today, or government ID.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To generate the robot voice you requested.</li>
          <li>To enforce the daily free allowance and script length cap.</li>
          <li>To store and serve the audio file for playback and download.</li>
          <li>To fix errors and keep the service running.</li>
          <li>
            To respond if you email us, including privacy or abuse reports.
          </li>
        </ul>
      </section>

      <section>
        <h2>Processors and sharing</h2>
        <p>
          Your script is sent to a speech provider so it can be spoken, then we
          apply the robot mix. Today that speech step uses Replicate (MiniMax
          TTS). Audio files are stored on Cloudflare R2. Hosting and the
          database are provided by our infrastructure vendors. Those companies
          process data on our instructions to run the product. We do not sell
          your scripts or audio as a dataset.
        </p>
        <p>
          We may disclose information if required by law, or to protect the
          service against abuse.
        </p>
      </section>

      <section id="cookies">
        <h2>Cookies</h2>
        <p>
          We use first-party cookies only when a feature needs them (for
          example a guest session id or a login session). They are not required
          to read these pages. You can block cookies in your browser; the
          generator may still work, but we may rate-limit by IP hash instead.
        </p>
      </section>

      <section>
        <h2>Advertising and analytics</h2>
        <p>
          We do not currently run third-party display ads or Google AdSense on
          this site. If we later use Google advertising or measurement products,
          those products may use cookies, web beacons, IP addresses, or similar
          identifiers to serve and measure ads. Third parties, including Google,
          may then place or read cookies on your browser or use identifiers
          because ads or analytics are present.
        </p>
        <p>
          If that happens, Google’s use of data is described in{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="noopener noreferrer"
            target="_blank"
          >
            How Google uses information from sites or apps that use our services
          </a>
          . You can opt out of personalized Google ads at{" "}
          <a
            href="https://adssettings.google.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          . We will keep this section aligned with whatever we actually ship.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          Generation records and audio files are kept long enough to serve the
          clip and operate the product. Daily IP-hash counters are keyed to a
          calendar day. We may delete older files or logs when they are no
          longer needed. Email you send us is kept as long as needed to handle
          the request.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          The generator is a general-audience tool. It is not directed at
          children under 13, and we do not knowingly collect personal
          information from children. If you believe a child submitted data,
          email us and we will delete it.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can stop using the site at any time. For access, correction, or
          deletion of generation or account data we hold, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may need
          enough detail to find the records. Depending on where you live, you
          may have additional rights under local law.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We will update this page when the product or our vendors change in a
          way that affects privacy. The date at the top is the latest revision.
          Related rules for using the generator are in the{" "}
          <Link href="/terms">terms of use</Link>.
        </p>
      </section>
    </LegalDoc>
  );
}
