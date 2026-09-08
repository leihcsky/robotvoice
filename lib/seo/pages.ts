import type { RobotPresetId } from "@/lib/audio/presets";
import { getSiteUrl } from "@/lib/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  body: string;
}

export interface UseCase {
  title: string;
  body: string;
}

export interface BranchPageContent {
  path: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  howHeading: string;
  howSteps: HowToStep[];
  useCasesHeading: string;
  useCasesIntro: string;
  useCases: UseCase[];
  recipesHeading: string;
  recipesBody: string;
  faqHeading: string;
  faqIntro: string;
  faqs: FaqItem[];
  defaultPreset: RobotPresetId;
  presetIds: RobotPresetId[];
  defaultText: string;
  fullSetHint: string;
  siblingHref: string;
  siblingLabel: string;
}

export const FEMALE_PAGE: BranchPageContent = {
  path: "/female-robot-voice-generator",
  title: "Female Robot Voice Generator — Type Text, Get a Female Robot Voice",
  description:
    "Female robot voice generator for AI assistants, android characters, and game NPCs. Type a line and generate a female-source robot voice in the browser.",
  h1: "Female Robot Voice Generator",
  lead: "This female robot voice generator turns a written line into a robot voice that reads as female—an assistant, an android, a ship computer—not a deep male commander. Play the mix, type the script, generate.",
  howHeading: "How this female robot voice generator works",
  howSteps: [
    {
      title: "Preview the female robot mix",
      body: "The default mix on this page uses a female source, so the metal sits in a girl or woman range. Play a sample to hear it; playing also selects that mix for Generate.",
    },
    {
      title: "Type the line the character should say",
      body: "A greeting, a status read, an NPC hint, a short for a video. Generate speaks your words. You do not record a microphone.",
    },
    {
      title: "Generate and use the clip",
      body: "Play it on the page, save it from the player, and drop it on a timeline or into a game. Short lines are easier to time than a monologue.",
    },
  ],
  useCasesHeading: "This tool makes the female robot audio you need",
  useCasesIntro:
    "You already have the assistant line, the android beat, or the NPC cue. You need a generator that speaks it as a female robot—not a male commander. Type it above, generate, take the file.",
  useCases: [
    {
      title: "AI assistants and product bots",
      body: "You already have the UI line. Type it, generate, drop the file into the video or the prototype. One instruction per clip.",
    },
    {
      title: "Sci-fi androids and ship computers",
      body: "You already have the shot. Type what she should say, generate, lay the file under the picture.",
    },
    {
      title: "Game companions and NPCs",
      body: "You already have the cue. Type the in-game sentence, generate one file, drop it in the engine. Repeat per line.",
    },
    {
      title: "YouTube and shorts characters",
      body: "You already have the bit. Type the line, generate, drop the file on the edit. Next beat, next clip.",
    },
  ],
  recipesHeading: "Why this page stays female",
  recipesBody:
    "Classic, Deep, and Futuristic on the full generator start from a male source—the usual commander robot. This page starts from a female source so the result still reads as a woman machine after the metal is added. The picker above has two female mixes: a brighter helper (labeled Cute) and a colder, more processed take (labeled Villain). Play them if you want a different temperature; leave source voice on Robot Female. Open tweaks and switch to male or narrator, and it is no longer a female robot voice.",
  faqHeading: "Before you generate",
  faqIntro:
    "Whether it sounds like a woman or a machine, how it stays female, and how to use the clip.",
  faqs: [
    {
      question: "Will this sound like a real woman, or like a female robot?",
      answer:
        "Like a female robot. The source is female, then the recipe adds metal. It is not a natural speaking voice and not ordinary female text to speech. If you want a human woman VO, this page is the wrong tool; if you want an assistant or android that still reads as female, this is the mix.",
    },
    {
      question: "How is this different from the usual male robot voice?",
      answer:
        "Most robot generators default to a low male commander. This page uses a female source so pitch and timbre stay in a girl or woman range after processing. That is the whole point of landing here instead of the homepage.",
    },
    {
      question: "Do I need to record my own voice?",
      answer:
        "No. Type or paste the line. There is no upload and no voice changer. Recording yourself and running a vocoder is a different workflow; here the generator speaks the text.",
    },
    {
      question: "Can I use this for an AI assistant, a game, or a YouTube character?",
      answer:
        "Yes. Those are the usual jobs: a helper bot, a ship computer, an NPC, a recurring shorts character. Generate, save from the player, and drop the file on the timeline or into the engine. One short line is easier to place than a paragraph.",
    },
    {
      question: "The preview is a different sentence. Will my script still sound female?",
      answer:
        "Yes. The preview only shows the mix, not your words. Generate keeps that female-source mix and speaks what you typed. If you opened Optional tweaks and changed source voice, pitch, or intensity a long way, the result can leave that character—use Reset to get the preview mix back.",
    },
    {
      question: "I tweaked it and it sounds male, or too crushed. What happened?",
      answer:
        "Source voice in Optional tweaks is the usual cause of a male result—leave it on Robot Female. Too crushed usually means Robot Intensity was pushed up. Reset returns to the locked sample mix on this page.",
    },
    {
      question: "What if I wanted a male robot or a horror robot instead?",
      answer:
        "Male recipes (Classic, Deep, Futuristic, Announcer) live on the full robot voice generator. A colder, creepier antagonist mix is on the creepy robot voice generator. This page stays on female-source mixes so those jobs stay on their own pages.",
    },
  ],
  defaultPreset: "cute-robot",
  presetIds: ["cute-robot", "villain-robot"],
  defaultText:
    "Hello. I am your assistant. I can help you with the next step.",
  fullSetHint: "Want a male robot mix instead?",
  siblingHref: "/creepy-robot-voice-generator",
  siblingLabel: "Creepy robot voice generator",
};

export const CREEPY_PAGE: BranchPageContent = {
  path: "/creepy-robot-voice-generator",
  title: "Creepy Robot Voice Generator — Type Text, Get a Creepy Robot Voice",
  description:
    "Creepy robot voice generator for horror shorts, antagonist AI, and prank alerts. Type a line and generate a cold, processed robot voice in the browser.",
  h1: "Creepy Robot Voice Generator",
  lead: "This creepy robot voice generator turns a written line into a machine that feels wrong—an antagonist AI, a corrupted warning, a jump-scare sting—not a friendly assistant. Play the mix, type the script, generate.",
  howHeading: "How this creepy robot voice generator works",
  howSteps: [
    {
      title: "Preview the creepy mix",
      body: "The default mix on this page is meant to sound less human than a clean robot: slower, more vocoder, more grit. Play a sample to hear it; playing also selects that mix for Generate.",
    },
    {
      title: "Type the threat, the warning, or the joke",
      body: "A horror short line, a fake system alert, a boss taunt. Generate speaks your words. You do not record a microphone.",
    },
    {
      title: "Generate and drop it on the edit",
      body: "Play it here, save it from the player, and place it on a short, a game cue, or a prank clip. One cold sentence times better than a speech.",
    },
  ],
  useCasesHeading: "This tool makes the creepy robot audio you need",
  useCasesIntro:
    "You already have the horror beat, the antagonist line, or the prank. You need a generator that speaks it as a cold machine—not a helper bot. Type it above, generate, take the file.",
  useCases: [
    {
      title: "Horror shorts and jump-scare stings",
      body: "You already have the cut. Type the line, generate, drop the file on the sting. Keep it short.",
    },
    {
      title: "Antagonist AI and evil computers",
      body: "You already have the boss or the system that should not still be talking. Type the line, generate, put the file in the scene.",
    },
    {
      title: "Prank alerts and fake PA",
      body: "You already have the joke. Type the warning, generate, play it. A short alert lands; a speech does not.",
    },
    {
      title: "Horror games and ARG drops",
      body: "You already have the cue. Type it, generate one file, drop it in the engine or on the timeline. Repeat per line.",
    },
  ],
  recipesHeading: "Why this page sounds wrong on purpose",
  recipesBody:
    "A normal robot voice is still trying to speak clearly. Creepy is the opposite: the default mix on this page is crushed on purpose so it feels like a vocoder antagonist, not an announcer. The picker also has a darker male-source mix (labeled Futuristic) if you want processed metal without the same crush. Leave the sample mix unless you are chasing a harsher sting. Switch source voice or raise pitch a lot in tweaks, and it stops being creepy. A bright assistant belongs on the female robot voice generator; Classic lives on the full generator.",
  faqHeading: "Before you generate",
  faqIntro:
    "Why it sounds crushed, whether you need a mic, and how to use a line in a horror or prank clip.",
  faqs: [
    {
      question: "Why does the sample sound crushed, like it is not really speaking?",
      answer:
        "That is the point of this page. The default mix is built to feel like a vocoder antagonist, not a clean robot. If it is too destroyed to understand the line, lower Robot Intensity in Optional tweaks, or try the darker mix in the picker. Reset puts the locked sample mix back.",
    },
    {
      question: "Is this a creepy robot, or a ghost / demon / scary human voice?",
      answer:
        "A creepy robot. It is still a machine mix—metal, vocoder, processed speech—not a whisper ghost or a scream. If you need a haunted-human narrator, this is the wrong tool; if you need an AI that should not still be talking, this is the mix.",
    },
    {
      question: "Do I need to record my own voice?",
      answer:
        "No. Type or paste the line. There is no upload and no voice changer. You are not running a vocoder on a take; the generator speaks the text in the creepy mix.",
    },
    {
      question: "Can I use this for a horror YouTube video, a game, or a prank?",
      answer:
        "Yes. Those are the usual jobs: a jump-scare sting, an antagonist AI, a fake system alert. Generate, save from the player, and drop the file on the timeline or into the engine. One short threat is easier to time than a paragraph.",
    },
    {
      question: "The preview is a different sentence. Will my line still sound creepy?",
      answer:
        "Yes. The preview only shows the mix, not your words. Generate speaks what you typed in that mix. If you opened Optional tweaks and raised pitch, swapped to a helper-style female source, or flattened intensity, the result can leave the creepy character—use Reset to get the sample mix back.",
    },
    {
      question: "It is too harsh, or not creepy enough, after I touched tweaks. What now?",
      answer:
        "Too harsh: lower Robot Intensity, or pick the darker (less crushed) mix in the picker. Not creepy enough: you probably brightened pitch or changed source voice toward a helper or announcer. Reset returns to the locked mix this page is built around.",
    },
    {
      question: "What if I wanted a friendly female robot or a normal sci-fi robot?",
      answer:
        "A female assistant or android belongs on the female robot voice generator. Classic, Deep, and Announcer—clearer male sci-fi—are on the full robot voice generator. This page stays on the colder, more processed mixes so horror and antagonist jobs are not mixed with those.",
    },
  ],
  defaultPreset: "villain-robot",
  presetIds: ["villain-robot", "futuristic-robot"],
  defaultText:
    "You should not have opened that file. I am still here. I am watching.",
  fullSetHint: "Want a friendly or classic robot instead?",
  siblingHref: "/female-robot-voice-generator",
  siblingLabel: "Female robot voice generator",
};

export function buildBranchJsonLd(page: BranchPageContent) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${page.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.h1,
        description: page.description,
        isPartOf: {
          "@type": "WebSite",
          name: "Robot Voice Generator",
          url: `${siteUrl}/`,
        },
        inLanguage: "en",
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: page.howHeading,
        description: page.lead,
        step: page.howSteps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: page.faqs.map((item) => ({
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
