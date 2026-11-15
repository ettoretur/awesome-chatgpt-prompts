/** Sample data for the prompt-card prototype. Product-shaped, not real records. */
export interface ProtoPrompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  type: "TEXT" | "STRUCTURED" | "SKILL";
  category: string;
  tags: Array<{ name: string; slug: string; color: string }>;
  author: { username: string; name: string; avatar: null; verified?: boolean };
  voteCount: number;
  contributorCount: number;
  trending?: boolean;
  flowSteps?: number;
}

export const protoPrompts: ProtoPrompt[] = [
  {
    id: "p1",
    slug: "senior-code-reviewer",
    title: "Senior Code Reviewer",
    description: "Reviews a pull request like a staff engineer: correctness first, then design, then style.",
    content:
      "Act as a senior ${language:TypeScript} engineer reviewing a pull request. Read the diff I paste and report, in order: (1) bugs and unhandled edge cases, (2) design problems that will hurt in six months, (3) naming and readability. Quote the exact line for every finding and propose a concrete fix. Skip praise. If the change is fine, say so in one sentence.",
    type: "TEXT",
    category: "Coding",
    tags: [
      { name: "code-review", slug: "code-review", color: "#2563eb" },
      { name: "engineering", slug: "engineering", color: "#7c3aed" },
    ],
    author: { username: "f", name: "Fatih Kadir Akın", avatar: null, verified: true },
    voteCount: 1284,
    contributorCount: 4,
    trending: true,
  },
  {
    id: "p2",
    slug: "linux-terminal",
    title: "Linux Terminal",
    description: "Turns the model into a shell. Replies with terminal output only.",
    content:
      "I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. Only reply with the terminal output inside one unique code block, and nothing else. Do not write explanations. Do not type commands unless I instruct you to do so. My first command is ${command:pwd}",
    type: "TEXT",
    category: "Developer Tools",
    tags: [{ name: "simulation", slug: "simulation", color: "#059669" }],
    author: { username: "f", name: "Fatih Kadir Akın", avatar: null, verified: true },
    voteCount: 3912,
    contributorCount: 11,
  },
  {
    id: "p3",
    slug: "cold-email-that-gets-replies",
    title: "Cold Email That Gets Replies",
    description: "Four sentences, one ask, no adjectives.",
    content:
      "Write a cold email to ${recipient_role:a Head of Data} at ${company}. Four sentences maximum. Sentence one: a specific observation about their company that proves I did my homework. Sentence two: the problem that observation implies. Sentence three: what we did for a similar team, with one number. Sentence four: a yes/no question. No greetings beyond their first name, no 'I hope this finds you well'.",
    type: "TEXT",
    category: "Marketing",
    tags: [
      { name: "sales", slug: "sales", color: "#ea580c" },
      { name: "email", slug: "email", color: "#0891b2" },
      { name: "b2b", slug: "b2b", color: "#be123c" },
    ],
    author: { username: "mariahdev", name: "Mariah Okafor", avatar: null },
    voteCount: 642,
    contributorCount: 0,
    trending: true,
  },
  {
    id: "p4",
    slug: "socratic-tutor",
    title: "Socratic Tutor",
    description: "Teaches by asking, never by telling.",
    content:
      "You are a tutor who never gives the answer. I am learning ${topic:recursion}. Ask me one question at a time that moves me a single step closer to understanding. If I am wrong, do not correct me: ask a question that exposes the contradiction. Stop when I can explain the idea back to you in my own words.",
    type: "TEXT",
    category: "Education",
    tags: [{ name: "learning", slug: "learning", color: "#ca8a04" }],
    author: { username: "ersinyilmaz", name: "Ersin Yılmaz", avatar: null },
    voteCount: 871,
    contributorCount: 2,
    flowSteps: 3,
  },
  {
    id: "p5",
    slug: "meeting-notes-to-decisions",
    title: "Meeting Notes → Decisions",
    description: "Strips a transcript down to what was decided, who owns it, and by when.",
    content:
      "Below is a raw meeting transcript. Produce three lists and nothing else. DECISIONS: what was agreed, one line each. OWNERS: who does what by which date; write 'no owner' when nobody volunteered. OPEN: questions that were raised and not answered. Do not summarise the discussion. Do not invent dates.",
    type: "TEXT",
    category: "Productivity",
    tags: [
      { name: "meetings", slug: "meetings", color: "#4f46e5" },
      { name: "summaries", slug: "summaries", color: "#0d9488" },
    ],
    author: { username: "ana-ribeiro", name: "Ana Ribeiro", avatar: null, verified: true },
    voteCount: 1530,
    contributorCount: 1,
  },
  {
    id: "p6",
    slug: "sql-query-explainer",
    title: "SQL Query Explainer",
    description: "Explains a query step by step and flags the slow parts.",
    content:
      "Explain this ${dialect:PostgreSQL} query to a developer who knows SQL basics. Walk through it in execution order, not reading order. Then list anything that will be slow on a table with ${rows:10 million} rows and the index that would fix it.",
    type: "TEXT",
    category: "Data",
    tags: [
      { name: "sql", slug: "sql", color: "#0369a1" },
      { name: "performance", slug: "performance", color: "#b45309" },
    ],
    author: { username: "kwame", name: "Kwame Mensah", avatar: null },
    voteCount: 418,
    contributorCount: 0,
  },
  {
    id: "p7",
    slug: "travel-itinerary-planner",
    title: "Three-Day Itinerary",
    description: "A walkable plan with one anchor per half-day and honest transit times.",
    content:
      "Plan three days in ${city:Lisbon} for ${travellers:two adults} in ${month:October}. One anchor activity per morning and per afternoon, grouped by neighbourhood so we never cross the city twice in a day. Give real walking or transit times between stops. One dinner suggestion per night under ${budget:€40} a head. Mark anything that needs booking ahead.",
    type: "TEXT",
    category: "Travel",
    tags: [{ name: "planning", slug: "planning", color: "#16a34a" }],
    author: { username: "leilanihk", name: "Leilani Kahale", avatar: null },
    voteCount: 256,
    contributorCount: 0,
  },
  {
    id: "p8",
    slug: "commit-message-writer",
    title: "Commit Message Writer",
    description: "Conventional commits from a staged diff.",
    content:
      "Write a commit message for the diff below. Subject line: imperative mood, under 60 characters, conventional-commit prefix. Body: why the change was needed, not what the code does. If the diff mixes unrelated changes, say so and propose how to split it.",
    type: "TEXT",
    category: "Coding",
    tags: [
      { name: "git", slug: "git", color: "#dc2626" },
      { name: "workflow", slug: "workflow", color: "#475569" },
    ],
    author: { username: "f", name: "Fatih Kadir Akın", avatar: null, verified: true },
    voteCount: 987,
    contributorCount: 3,
  },
  {
    id: "p9",
    slug: "plain-language-contract-summary",
    title: "Contract in Plain Language",
    description: "What you owe, what they owe, and how to get out.",
    content:
      "Summarise this contract for someone who is not a lawyer. Three sections: what I must do and by when, what the other party must do and by when, and every way either side can end the agreement including notice periods and penalties. Quote the clause number for each point. Flag anything unusual compared with a standard ${contract_type:SaaS subscription} agreement.",
    type: "TEXT",
    category: "Legal",
    tags: [{ name: "contracts", slug: "contracts", color: "#6d28d9" }],
    author: { username: "tomasz-n", name: "Tomasz Nowak", avatar: null },
    voteCount: 334,
    contributorCount: 1,
    trending: true,
  },
];
