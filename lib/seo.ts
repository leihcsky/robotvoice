export const BRAND_NAME = "Robot Voice";
export const BRAND_DOMAIN = "robotvoice.org";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    `https://${BRAND_DOMAIN}`;
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "Robot Voice Generator";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || `hello@${BRAND_DOMAIN}`;

export const LEGAL_UPDATED = "September 8, 2026";

export const HOME_TITLE = "Robot Voice Generator — Type Text, Get a Robot Voice";

export const HOME_DESCRIPTION =
  "Free robot voice generator: type a script and generate a robot voice for video voiceover, game lines, or prank audio.";

export const HOW_IT_WORKS = [
  {
    title: "Preview a mix",
    body: "Play samples until the robot matches the job—sci-fi line, assistant, horror sting, or PA. The one marked using is what Generate will speak.",
  },
  {
    title: "Type the script",
    body: "Paste the line you want spoken. The robot voice generator reads your words in the mix you picked.",
  },
  {
    title: "Generate the clip",
    body: "Create the robot voice in the browser, play it back, and save the audio for a video, a game cue, or a prank clip.",
  },
] as const;

export const HOME_USE_CASES_HEADING = "This tool makes the robot audio you need";

export const HOME_USE_CASES_INTRO =
  "You probably already have the scene: a video, a prank, a game line. You need a tool that speaks the text and gives you the audio. Type it above, generate, take the file.";

export const HOME_USE_CASES = [
  {
    title: "YouTube, shorts, and TikTok",
    body: "You already have the cut. Type the sentence, hit Generate, drop the file on the timeline. No mic, no studio session.",
  },
  {
    title: "Prank clips and fake alerts",
    body: "You already have the joke. Type the warning or fake OS line, generate, play it. Keep it short so it sounds like a real alert.",
  },
  {
    title: "Game NPCs and AI characters",
    body: "You already have the cue. Type the in-game sentence, generate one file, drop it in the engine. Repeat per line.",
  },
  {
    title: "Sci-fi scenes and trailers",
    body: "You already have the shot. Type what the computer or android should say, generate, lay it under the picture.",
  },
] as const;

export const HOME_RECIPE_JOBS: Record<string, string> = {
  "classic-robot": "Start here for a sci-fi video line or a generic NPC.",
  "deep-robot": "Use when the robot should sound like a commander, not a thin tin can.",
  "futuristic-robot": "Darker processed metal for a trailer sting or a colder computer.",
  "cute-robot": "Bright female helper—greetings, mascots, assistant bots.",
  "villain-robot": "Cold antagonist AI for horror stings, bosses, and fake alerts.",
  "announcer-robot": "Ship PA, radio, or broadcast-style robot lines.",
};

export const FAQS = [
  {
    question: "How do I make a robot say my script?",
    answer:
      "Play a recipe until you like the sound, type or paste the words in the script box, then hit Generate. The robot voice generator speaks that text in the mix you picked. When it finishes, play the clip and save the audio.",
  },
  {
    question: "The preview is a different sentence. Will my line still sound like that?",
    answer:
      "Yes. Each preview is a locked example of the recipe’s sound, not your script. Generate keeps that mix and speaks your words. If you opened Optional tweaks and moved intensity, speed, pitch, or source voice, the result will no longer match the sample—use Reset to get the preview mix back.",
  },
  {
    question: "Which mix should I start with?",
    answer:
      "Classic for a default sci-fi line. Deep if it should sound like a commander. Announcer for PA or radio. Cute for a bright female helper; Villain when it should feel like a cold AI. Play them; Generate uses the one marked using.",
  },
  {
    question: "How do I put this on a video, a game, or a prank clip?",
    answer:
      "After Generate, save the file from the player and drop it on your timeline or into the engine. YouTube, a short, a joke video, an NPC line—same steps. You do not need to record a mic. Short lines are easier to place than a monologue.",
  },
  {
    question: "I need a female robot or a horror robot. Do I stay here?",
    answer:
      "This page can generate all six mixes. If the whole job is a female assistant or android, the female robot voice generator is built around that. If the job is a creepy antagonist or jump-scare sting, use the creepy robot voice generator. Classic here is the default sci-fi male robot.",
  },
  {
    question: "How long can my script be?",
    answer:
      "Keep it to a short line—up to 300 characters per clip. That is enough for a video VO, a game hint, or a prank sentence. Each network has a daily free allowance; if you hit it, try again tomorrow.",
  },
  {
    question: "Do I need a microphone?",
    answer:
      "No. Type the line. The robot voice generator speaks written text—you do not record or upload a voice. Think of it as text to speech, but only in a robot mix.",
  },
  {
    question: "How do I make it more metallic, slower, or higher?",
    answer:
      "Open Optional tweaks. Intensity pushes the robot mix harder. Speed and pitch change delivery. Source voice switches the male, female, or narrator base. If it goes too far from the sample, Reset returns to the preview mix.",
  },
] as const;

export function buildHomeJsonLd(siteUrl: string) {
  const home = `${siteUrl}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        name: SITE_NAME,
        alternateName: BRAND_NAME,
        url: home,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${home}#app`,
        name: SITE_NAME,
        alternateName: BRAND_NAME,
        url: home,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        inLanguage: "en",
        description: HOME_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "HowTo",
        "@id": `${home}#howto`,
        name: "How to use this robot voice generator",
        description:
          "Turn written text into a robot voice: preview a recipe, type your script, generate, and save the audio.",
        step: HOW_IT_WORKS.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${home}#faq`,
        mainEntity: FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
