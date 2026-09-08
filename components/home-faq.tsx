import { FAQS } from "@/lib/seo";

export function HomeFaq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        Common questions
      </h2>
      <p className="text-muted">
        How to generate a clip and get the file into your video, game, or prank.
      </p>
      <div className="space-y-4">
        {FAQS.map((item) => (
          <article
            key={item.question}
            className="rounded-2xl border border-line bg-panel px-4 py-4"
          >
            <h3 className="text-base font-semibold">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
