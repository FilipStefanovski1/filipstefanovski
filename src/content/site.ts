/**
 * Central, typed content for the portfolio.
 * Keep claims conservative: only publish what is verified or supplied by Filip.
 */

export type ContactLink = {
  label: string;
  href: string;
};

export type Evidence =
  | {
      kind: "screenshot";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    }
  | {
      kind: "illustration";
      /** Key of an illustrative composition rendered in code with synthetic data. */
      id: IllustrationId;
      caption: string;
    };

export type IllustrationId =
  | "q4-answer"
  | "q4-sheet"
  | "internal-board"
  | "internal-overview"
  | "smcc-public"
  | "smcc-member";

export type Decision = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  /** One sentence said on stage. */
  line: string;
  /** Three things Filip built, shown in the segment. */
  built: string[];
  index: string;
  title: string;
  kind: string;
  /** Neutral description of Filip's role. No formal titles without evidence. */
  role: string;
  summary: string;
  url?: string;
  tags: string[];
  caseStudy: {
    lede: string;
    problem: string;
    contribution: string[];
    decisions: Decision[];
    evidence: Evidence[];
    note?: string;
  };
};

export type SupportingWork = {
  title: string;
  role: string;
  body: string;
};

export const site = {
  name: "Filip Stefanovski",
  shortName: "Filip",
  role: "Product Developer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://filipstefanovski.vercel.app",
  description:
    "Filip Stefanovski is a product developer. He takes products from the first idea to the version people use: product thinking, interface, frontend and AI.",
  linkedin: "https://www.linkedin.com/in/filipstefanovskii/",
  hero: {
    intro: "I build products. Idea to shipped.",
    meta: ["Product Developer", "Macedonia / Belgium"],
  },
  about: {
    heading: "Backstage",
    line: "Product developer. Macedonian, trained in Belgium. Played pro basketball first.",
    facts: [
      { label: "From", value: "Macedonia" },
      { label: "Studied", value: "Thomas More, Belgium" },
      { label: "Speaks", value: "Four languages" },
      { label: "Before", value: "Pro basketball" },
    ],
  },
  close: {
    heading: "Let's build yours.",
    action: "LinkedIn",
  },
  /** Only verified links. */
  contact: {
    email: undefined as string | undefined,
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/filipstefanovskii/" }] as ContactLink[],
  },
};

export const projects: Project[] = [
  {
    slug: "q4",
    line: "AI research for the Saudi market. Every answer cited.",
    built: ["Research across filings, documents and earnings calls", "Cited answers and spreadsheet workflows", "Model selection and AI integrations"],
    index: "01",
    title: "Q4",
    kind: "AI financial research",
    role: "Co-founder",
    summary:
      "An AI research workspace for Saudi companies. Filings, financial documents and earnings calls in one place, with answers you can trace back to the page they came from.",
    url: "https://q4.sa",
    tags: ["Product design", "Frontend", "AI integrations", "Data workflows"],
    caseStudy: {
      lede:
        "Q4 brings Saudi market research, company data, filings and AI into one workspace. I work on the product: designing and building the research experience and the internal tools around it.",
      problem:
        "Research on Saudi companies lives in annual reports, quarterly filings, investor decks and hours of earnings call audio. An AI answer only helps an analyst if they can see where every number came from and check it in seconds. The hard part is not generating text. It is making complex material easy to navigate and easy to verify.",
      contribution: [
        "Research experiences across company filings, financial documents and earnings calls",
        "Answer views with source citations that lead back to the original document",
        "Financial data and spreadsheet workflows, so research can end up in a model",
        "Model selection and AI integrations inside the product",
        "Internal tools for the team",
      ],
      decisions: [
        {
          title: "Every figure points to a page",
          body:
            "Citations sit inline with the answer, not in a footnote dump. Selecting a figure opens the source it came from, so checking a claim is one move instead of a search.",
        },
        {
          title: "One flow for every format",
          body:
            "Transcripts, presentations and PDFs open in the same reading surface. An analyst should not have to change tools because the source changed format.",
        },
        {
          title: "Research ends in a spreadsheet",
          body:
            "Financial work usually finishes in a model. Tables in answers are structured data that can move into sheet workflows, not screenshots of numbers.",
        },
        {
          title: "Models are a setting, not the story",
          body:
            "Model selection lives in the product as a choice the user can make. The interface stays focused on the research, whichever model is doing the work.",
        },
      ],
      evidence: [
        {
          kind: "screenshot",
          src: "/work/q4-site.jpg",
          alt: "The public Q4 website hero with the headline The future of Saudi Finance, set over a city skyline.",
          caption: "Public website, q4.sa",
          width: 1728,
          height: 792,
        },
        {
          kind: "illustration",
          id: "q4-answer",
          caption: "Illustrative. A cited answer pattern, recreated with synthetic companies and figures.",
        },
        {
          kind: "illustration",
          id: "q4-sheet",
          caption: "Illustrative. Moving an answer into a spreadsheet model, synthetic data.",
        },
      ],
    },
  },
  {
    slug: "aminta",
    line: "An X companion that writes in your voice and levels up as you post.",
    built: ["Browser extension that works inside X", "Voice profile from your own posts", "XP, streaks and evolving forms"],
    index: "02",
    title: "Aminta",
    kind: "AI writing companion for X",
    role: "Founder",
    summary:
      "A browser extension that lives inside X. It learns how you write, drafts posts and replies in your voice, and grows a companion that evolves the more you post.",
    url: "https://www.amintaapp.com",
    tags: ["Product", "Browser extension", "AI", "Gamification"],
    caseStudy: {
      lede: "Aminta lives inside X. It learns how you write and turns a rough idea into a post, a reply or a thread that sounds like you.",
      problem:
        "Most people know what they want to say on X and stall on how to say it. Generic AI writers sound like everyone else, and separate tools pull you out of the timeline.",
      contribution: [
        "Browser extension that generates inside X",
        "Voice profile built from your recent posts",
        "Generate, reply, polish and thread tools",
        "XP, streaks and a companion with evolving forms",
        "Included AI credits or your own key (Groq, Gemini, OpenRouter)",
        "Landing site and pricing",
      ],
      decisions: [
        {
          title: "Live in the timeline",
          body: "No new tab and no scheduler. Aminta sits where you already write and inserts straight into X.",
        },
        {
          title: "Your voice, not AI voice",
          body: "Every draft is shaped by a profile of your own posts, refreshed weekly.",
        },
        {
          title: "A reason to come back",
          body: "Posting earns XP. The companion evolves through forms, from Dormant to Legendary.",
        },
        {
          title: "Bring your own key",
          body: "Credits are included, and anyone who prefers their own model can switch any time.",
        },
      ],
      evidence: [
        {
          kind: "screenshot",
          src: "/work/aminta-site.jpg",
          alt: "The Aminta website hero: Feed Aminta. Grow on X, beside the extension panel drafting a post inside X.",
          caption: "Public website, amintaapp.com",
          width: 1728,
          height: 880,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-forms.jpg",
          alt: "A grid of Aminta companion forms, from Dormant and Curious to Mischievous and Confident, each in its own pixel-art scene.",
          caption: "The companion's evolving forms, amintaapp.com",
          width: 1728,
          height: 752,
        },
      ],
    },
  },
  {
    slug: "smcc",
    line: "Chamber of commerce site and member portal.",
    built: ["Public site design and frontend", "Member login, admin and onboarding emails", "Multilingual, responsive layouts"],
    index: "03",
    title: "SMCC",
    kind: "Website and member portal",
    role: "Design, frontend and digital operations",
    summary:
      "A chamber of commerce website and the member experience behind it. One visual language from the public page to the login, onboarding and emails.",
    tags: ["Web design", "Frontend", "Member portal", "Multilingual"],
    caseStudy: {
      lede:
        "SMCC is a chamber of commerce. I have been involved in its digital operations and helped build its digital presence, from the public website to the member experience.",
      problem:
        "A chamber has two audiences. The public site has to explain what it is and why a business should join. Members need a place to log in, manage their membership and hear from the chamber. When those feel like two different products, trust leaks between them.",
      contribution: [
        "Public website design and frontend improvements",
        "Member login and administration experiences",
        "Multilingual presentation",
        "Membership onboarding and email flows",
        "Responsive layouts and consistent typography",
      ],
      decisions: [
        {
          title: "The login is part of the website",
          body:
            "The member side uses the same typography, spacing and tone as the public site. Signing in should feel like walking further into the same building.",
        },
        {
          title: "Onboarding continues in the inbox",
          body:
            "Membership emails carry the same voice and structure as the site, so a new member recognises the chamber at every step.",
        },
        {
          title: "Languages without a second site",
          body:
            "Multilingual content is part of the structure from the start, rather than a translated copy maintained separately.",
        },
      ],
      evidence: [
        {
          kind: "illustration",
          id: "smcc-public",
          caption: "Illustrative. Public page structure, placeholder content.",
        },
        {
          kind: "illustration",
          id: "smcc-member",
          caption: "Illustrative. Member sign in and onboarding, placeholder content.",
        },
      ],
      note: "Screens on this page are illustrative recreations. Approved screenshots will replace them.",
    },
  },
  {
    slug: "nordgate",
    line: "Your route into the Nordics.",
    built: ["Website design in a strong blue identity", "Responsive frontend", "Multilingual structure"],
    index: "04",
    title: "Nordgate",
    kind: "Brand website",
    role: "Website design and frontend",
    summary:
      "Your route into the Nordics. A photography-led site in a deep blue, with editorial serif type, for a company that helps businesses enter Nordic markets.",
    url: "https://thenordgate.com",
    tags: ["Web design", "Frontend", "Multilingual", "Editorial type"],
    caseStudy: {
      lede:
        "Nordgate helps companies enter and grow across Nordic markets, and connects Nordic businesses with teams in the Balkans. I worked on its website.",
      problem:
        "Market entry is a trust business. The site has to feel calm, local and serious enough that a company would hand over its Nordic expansion, while staying clear about what Nordgate actually does.",
      contribution: [
        "Website design within a strong blue brand identity",
        "Editorial serif typography around the line Your route into the Nordics",
        "Photography-led presentation",
        "Responsive frontend work",
        "Multilingual structure",
      ],
      decisions: [
        {
          title: "One blue, used with confidence",
          body:
            "The brand blue carries whole sections instead of appearing as a timid accent. White serif type on that field does most of the talking.",
        },
        {
          title: "Serif for the promise, sans for the detail",
          body:
            "Editorial serif headlines set the tone. Services, steps and navigation stay in a plain sans so they read quickly.",
        },
        {
          title: "Structure ready for more than one language",
          body:
            "Language switching is part of the site structure, because the audience is spread across several countries.",
        },
      ],
      evidence: [
        {
          kind: "screenshot",
          src: "/work/nordgate-site.jpg",
          alt: "The Nordgate website hero: white serif headline Your route into the Nordics on a deep blue background.",
          caption: "Public website, thenordgate.com",
          width: 1728,
          height: 792,
        },
      ],
    },
  },
];

export const supporting: SupportingWork[] = [
  {
    title: "Playground AI",
    role: "Designer",
    body: "",
  },
  {
    title: "Blockchain Skopje",
    role: "Co-founder",
    body: "Co-founded Blockchain Skopje, a Web3 community based in Skopje.",
  },
  {
    title: "Avalanche Team1",
    role: "Collaborator",
    body: "Collaborated with Avalanche Team1 as part of my Web3 community work.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
