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
      kind: "video";
      src: string;
      poster: string;
      /** Describes what plays, for screen readers. */
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
  x: "https://x.com/filiplesterr",
  xHandle: "filiplesterr",
  /** Buttondown newsletter username, for the podcast waitlist */
  buttondown: "filipstefanovski",
  hero: {
    intro: "I will outhustle you.",
    teaser: "Podcast coming soon",
    meta: ["Product Developer", "Macedonia / Belgium"],
  },
  about: {
    story: [
      "i'm from macedonia, and for a long time basketball was the plan. i moved to belgium for a better future and kept playing, first in the youth leagues, then in the top divisions. honestly, i thought my money would come from basketball. during my studies i even went back to macedonia to play division 1.",
      "building started on the side, in high school. code and design showed up at the same time, at full speed, and nobody was going to do either for me, so i learned both. that's still how i work. i don't hand a design to someone and wait, and i don't wait on a design to start coding. i take the idea and ship it.",
      "the first thing i shipped was profesija.mk, a job platform for macedonia, in 2020. it failed. so did the next ten or so projects. somewhere along the way it clicked: a dead project isn't the end, it's tuition.",
      "the ones that stuck all started with something that bugged me. a close friend tuned me in to making my own stuff and actually putting it out there, and that became blockchain skopje. writing tweets was painful, so i built aminta to fix it. saudi was missing something crucial and i knew i could build it, so q4 happened. on top of that, i'm a creative designer at playground ai.",
      "i'm not doing this for the vibes. money drives me, because money buys freedom, and freedom is the real goal. basketball gave me discipline. coding gave me patience. put the two together and you get someone who doesn't stop.",
      "people call me cocky. fair. i'm confident to the point some call it narcissistic, and i'm fine with that. confidence is what gets you to project eleven after ten failures. you can be more talented than me. i will still outhustle you.",
    ],
    beliefs: [
      { title: "Fail more.", body: "The more you fail, the better you get. Ten dead projects is a curriculum, not a record." },
      { title: "Confidence is a skill.", body: "Believe in yourself to the point people call it narcissism. Then prove them right about the results." },
      { title: "Discipline over talent.", body: "Basketball taught me that showing up every day beats showing off once." },
      { title: "Patience ships.", body: "Code doesn't care how you feel. You stay with it until it works." },
      { title: "One person, both halves.", body: "Design and code are one job. If you can only do half, you're always waiting on someone." },
    ],
  },
  close: {
    heading: "Your move.",
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
          kind: "video",
          src: "/work/q4-demo.mp4",
          poster: "/work/q4-demo.jpg",
          alt: "Q4 AI Chat answering how the Saudi healthcare sector performed in Q1 2026, building a revenue table and opening the source financial report.",
          caption: "Ask. Answer. Source.",
          width: 1240,
          height: 640,
        },
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
          kind: "video",
          src: "/work/aminta-demo.mp4",
          poster: "/work/aminta-demo.jpg",
          alt: "A scroll through the Aminta website: the X companion, how it works, the creature forms and features.",
          caption: "The site, top to bottom",
          width: 1280,
          height: 800,
        },
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
];

/** Projects that didn't make it. Shown crossed out, on purpose. */
export const graveyard = {
  projects: [
    { name: "Micori", what: "Safety status app", year: "2026", death: "Too small to take on Life360." },
    { name: "MKDiaspora", what: "Diaspora network", year: "2026", death: "Nobody cared." },
    { name: "profesija.mk", what: "Job platform", year: "2020", death: "Fully built. Couldn't sell it." },
  ],
  rest: "+ 6ish more",
};

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
