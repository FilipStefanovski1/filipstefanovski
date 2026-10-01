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
      /** Portrait captures (phones) render at phone width. */
      narrow?: boolean;
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
  x: "https://x.com/filiplesterr",
  xHandle: "@filiplesterr",
  hero: {
    intro: "I build products. Idea to shipped.",
    teaser: "Podcast coming soon",
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
    heading: "Say hi.",
  },
  /** Only verified links. */
  contact: {
    email: undefined as string | undefined,
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/filipstefanovskii/" },
      { label: "X", href: "https://x.com/filiplesterr" },
    ] as ContactLink[],
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
          src: "/work/q4-laptop.jpg",
          alt: "Q4 on a laptop: an answer about Al Rajhi Financials beside the cited source document.",
          caption: "The research workspace",
          width: 2000,
          height: 1422,
        },
        {
          kind: "screenshot",
          src: "/work/q4-chat.jpg",
          alt: "Q4 AI Chat with recent research threads in the sidebar.",
          caption: "AI Chat",
          width: 2000,
          height: 1042,
        },
        {
          kind: "screenshot",
          src: "/work/q4-ask.jpg",
          alt: "A cited answer comparing STC and Mobily revenue growth, with a table and sources.",
          caption: "Ask: a sourced answer",
          width: 1600,
          height: 738,
        },
        {
          kind: "screenshot",
          src: "/work/q4-verify.jpg",
          alt: "An answer about Al Rajhi Bank net income next to the exact passage in the annual report.",
          caption: "Verify: the figure next to its source",
          width: 1600,
          height: 738,
        },
        {
          kind: "screenshot",
          src: "/work/q4-model.jpg",
          alt: "A new model for Saudi Telecom, ready to build from Q4.",
          caption: "Model: from research to a spreadsheet",
          width: 1600,
          height: 738,
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
          src: "/work/aminta-extension.jpg",
          alt: "The Aminta extension panel with the Dormant level 1 companion, today's tasks and the Create with Aminta button.",
          caption: "The extension, from the Chrome Web Store listing",
          width: 1280,
          height: 800,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-hero.jpg",
          alt: "Aminta drafting a post inside X: the composer beside the extension panel.",
          caption: "Drafting inside X, amintaapp.com",
          width: 2000,
          height: 1194,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-inside.jpg",
          alt: "Three steps: you have an idea, Aminta helps shape it, earn XP and unlock evolutions.",
          caption: "The loop inside the timeline",
          width: 2000,
          height: 1083,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-features.jpg",
          alt: "Feature grid: Generate, Reply, Polish, Thread Creator, Voice Refresh and Included AI.",
          caption: "What it does",
          width: 2000,
          height: 1278,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-forms.jpg",
          alt: "A grid of Aminta companion forms from Dormant to Legendary, each in its own pixel-art scene.",
          caption: "Every form the companion can evolve into",
          width: 2000,
          height: 1431,
        },
        {
          kind: "screenshot",
          src: "/work/aminta-xp.jpg",
          alt: "Illustration: earn XP every time you post.",
          caption: "Chrome Web Store art",
          width: 1280,
          height: 800,
        },
      ],
    },
  },
  {
    slug: "blockchain-skopje",
    line: "Building Macedonia's onchain identity.",
    built: ["Web3 community", "Hackathon & Summit 2026", "Ecosystem partners"],
    index: "03",
    title: "Blockchain Skopje",
    kind: "Web3 community",
    role: "Co-founder",
    summary: "Building Macedonia's onchain identity.",
    url: "https://blockchainskopje.com",
    tags: ["Community", "Events", "Web3"],
    caseStudy: {
      lede: "Building Macedonia's onchain identity.",
      problem: "The talent is here. The connections aren't. Macedonia has builders, founders and students in Web3, and they rarely end up in the same room.",
      contribution: [
        "Co-founded the community",
        "Hackathon & Summit 2026: 40 hours of building at Base42, then a full-day Summit",
        "200+ attendees and 6+ speakers and mentors",
        "Partners from Macedonia and across the region",
      ],
      decisions: [
        {
          title: "Start with a room",
          body: "One weekend, one build sprint, one stage. Get people together first and let everything else follow.",
        },
        {
          title: "Local, connected outward",
          body: "Built in Skopje, linked to the Balkan and global ecosystem.",
        },
      ],
      evidence: [
        {
          kind: "screenshot",
          src: "/work/bks-site.jpg",
          alt: "The Blockchain Skopje website hero: the logo over a glowing purple horizon with three figures.",
          caption: "blockchainskopje.com",
          width: 1600,
          height: 1000,
        },
        {
          kind: "screenshot",
          src: "/work/bks-squad.jpg",
          alt: "The full group photo at Base42 in front of the graffiti wall.",
          caption: "The full squad, Hackathon & Summit 2026, Base42",
          width: 1478,
          height: 1072,
        },
        {
          kind: "screenshot",
          src: "/work/bks-winners.jpg",
          alt: "Winning teams on stage holding their prize boards.",
          caption: "Demo Day winners",
          width: 1478,
          height: 922,
        },
        {
          kind: "screenshot",
          src: "/work/bks-hackathon.jpg",
          alt: "A presenter on the Base42 stage under purple light.",
          caption: "Hackathon, Base42",
          width: 1392,
          height: 872,
        },
        {
          kind: "screenshot",
          src: "/work/bks-summit.jpg",
          alt: "A panel on stage at the Summit in front of a full room.",
          caption: "Summit, Holiday Inn Skopje",
          width: 1600,
          height: 1066,
        },
      ],
      note: "Photos from the Blockchain Skopje 2026 recap.",
    },
  },
  {
    slug: "smcc",
    line: "Swedish–Macedonian Chamber of Commerce. Site and member portal.",
    built: ["Public site design and frontend", "Member login, admin and onboarding emails", "Multilingual, responsive layouts"],
    index: "04",
    title: "SMCC",
    kind: "Website and member portal",
    role: "Design, frontend and digital operations",
    summary:
      "A chamber of commerce website and the member experience behind it. One visual language from the public page to the login, onboarding and emails.",
    url: "https://smcc.mk",
    tags: ["Web design", "Frontend", "Member portal", "Multilingual"],
    caseStudy: {
      lede: "SMCC is the Swedish–Macedonian Chamber of Commerce. I worked on its digital side, from the public website to the member experience.",
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
          kind: "screenshot",
          src: "/work/smcc-hero.jpg",
          alt: "The SMCC homepage: Where Swedish and Macedonian businesses connect, beside photos of Stockholm and Skopje.",
          caption: "smcc.mk",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/smcc-mk.jpg",
          alt: "The same homepage in Macedonian.",
          caption: "The Macedonian version, one of four languages",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/smcc-offers.jpg",
          alt: "What SMCC offers: networking and representation, market intelligence, visibility.",
          caption: "What membership offers",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/smcc-login.jpg",
          alt: "The member sign in page: Connecting Sweden and North Macedonia.",
          caption: "Member sign in",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/smcc-join.jpg",
          alt: "Join the chamber, beside the Macedonian and Swedish flags.",
          caption: "Join the chamber",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/smcc-launch.jpg",
          alt: "Watch the SMCC official launch, over a photo of the launch event.",
          caption: "The official launch",
          width: 1800,
          height: 1125,
        },
      ],
    },
  },
  {
    slug: "nordgate",
    line: "Your route into the Nordics.",
    built: ["Website design in a strong blue identity", "Responsive frontend", "Multilingual structure"],
    index: "05",
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
          alt: "The Nordgate hero: Your route into the Nordics, in white serif on deep blue.",
          caption: "thenordgate.com",
          width: 1728,
          height: 792,
        },
        {
          kind: "screenshot",
          src: "/work/ng-what.jpg",
          alt: "Growth in both directions: services list beside a photo.",
          caption: "What Nordgate does",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/ng-why.jpg",
          alt: "Ambition is rarely the problem, beside a photo of Stockholm.",
          caption: "Why local understanding matters",
          width: 1800,
          height: 910,
        },
        {
          kind: "screenshot",
          src: "/work/ng-onboard.jpg",
          alt: "Six onboarding steps from discovery to outreach.",
          caption: "From first conversation to live outreach",
          width: 1800,
          height: 879,
        },
        {
          kind: "screenshot",
          src: "/work/ng-cta.jpg",
          alt: "Ready to test the Nordic opportunity, beside a laptop photo.",
          caption: "The close",
          width: 1800,
          height: 1125,
        },
        {
          kind: "screenshot",
          src: "/work/ng-mobile.jpg",
          alt: "The Nordgate homepage on a phone.",
          caption: "On a phone",
          width: 900,
          height: 1948,
          narrow: true,
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
    title: "Avalanche Team1",
    role: "Collaborator",
    body: "Collaborated with Avalanche Team1 as part of my Web3 community work.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
