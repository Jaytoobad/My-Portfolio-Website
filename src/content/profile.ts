/**
 * Personal details and honest skill levels.
 *
 * Contact details that have not been provided are left `undefined`. The UI shows
 * them as "coming soon" instead of inventing anything. Fill them in here.
 */

export type ContactLink = {
  id: "email" | "linkedin" | "github" | "whatsapp";
  label: string;
  /** Full URL (mailto:, https:, wa.me). Leave undefined until the real one is known. */
  href?: string;
  /** Text shown next to the label, e.g. a handle. */
  display?: string;
};

export const CONTACT: readonly ContactLink[] = [
  // TODO(contact): add the real email address, e.g. href: "mailto:name@example.com"
  { id: "email", label: "Email" },
  // TODO(contact): add the real LinkedIn profile URL
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub", href: "https://github.com/Jaytoobad", display: "@Jaytoobad" },
  // TODO(contact): add a WhatsApp link, e.g. https://wa.me/233XXXXXXXXX
  { id: "whatsapp", label: "WhatsApp" },
];

export type StackLevel = "working" | "learning" | "workflow";

export const LEVEL_LABEL: Record<StackLevel, string> = {
  working: "Working knowledge",
  learning: "Learning and applying",
  workflow: "Part of my workflow",
};

export type StackGroup = {
  name: string;
  level: StackLevel;
  note: string;
  items: readonly string[];
};

// TODO(review): confirm these levels reflect how you'd describe each group yourself.
export const STACK: readonly StackGroup[] = [
  {
    name: "Development",
    level: "working",
    note: "What I use to build and ship real sites.",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Supabase", "Git"],
  },
  {
    name: "Creative technology",
    level: "learning",
    note: "Used on this site, and still being developed.",
    items: ["GSAP", "Three.js", "WebGL", "Adobe After Effects", "Lottie"],
  },
  {
    name: "AI-assisted workflow",
    level: "workflow",
    note: "How I plan, prototype, build and review faster.",
    items: ["Claude", "Kilo Code", "AI-assisted coding and prototyping tools"],
  },
];

export const EDUCATION = [
  { place: "Ghana Communication Technology University", detail: "Diploma in Information Technology" },
  { place: "Pope John Senior High School and Minor Seminary", detail: "General Science" },
] as const;

export const INTERESTS = [
  "Web development",
  "AI-assisted software development",
  "Digital experiences",
  "Motion design",
  "Creative technology",
] as const;
