export type ProjectStatus = "live" | "in-development" | "concept";

export type CaseStudyContent = {
  overview: string;
  opportunity: string;
  direction: string;
  process: readonly string[];
  contributions: readonly string[];
  /** Only include challenges that are real. An empty list hides the section. */
  challenges: readonly { title: string; body: string }[];
};

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  url?: string;
  summary: string;
  tags: readonly string[];
  stack: readonly string[];
  /** Shown for projects that are not finished yet. */
  progressNote?: string;
  caseStudy?: CaseStudyContent;
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  "in-development": "In development",
  concept: "Concept / in development",
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "the-strand-brand",
    name: "The Strand Brand",
    status: "live",
    url: "https://thestrandbrand.com",
    summary:
      "An e-commerce experience for a wig and beauty brand, focused on product discovery, shopping, customer experience and order management.",
    tags: ["E-commerce", "Frontend", "Payments", "Admin"],
    stack: ["Supabase", "Paystack", "Vercel", "JavaScript", "AI-assisted development"],
    caseStudy: {
      overview:
        "The Strand Brand is a destination for premium wigs and hair solutions. The site is where customers discover products, shop and pay, and where the brand manages its orders.",
      opportunity:
        "A hair and beauty brand lives or dies on trust and presentation. The goal was a store that makes browsing, choosing and paying feel simple for customers, while giving the owner a clear way to manage products and orders.",
      direction:
        "Luxury, versatility and confidence: a clean storefront that lets the products lead, with responsive layouts that work as well on a phone as on a desktop.",
      process: [
        "Built the responsive storefront interfaces for browsing and shopping.",
        "Connected Supabase for products, customers and orders.",
        "Integrated Paystack payments, using Supabase Edge Functions to initialise and verify transactions.",
        "Built product and order workflows for managing the store behind the scenes.",
        "Used AI-assisted development (Claude and Kilo Code) to plan, build and review changes.",
      ],
      contributions: [
        "Frontend development",
        "Responsive interfaces",
        "Supabase integration",
        "Paystack payment integration",
        "Product and order workflows",
        "AI-assisted development",
      ],
      challenges: [
        {
          title: "Payments across the browser and the backend",
          body: "Payments run through Supabase Edge Functions that initialise and verify Paystack transactions. Making them work reliably from the storefront meant handling cross-origin (CORS) requests carefully and keeping payment verification on the server side.",
        },
      ],
    },
  },
  {
    slug: "styledbyc",
    name: "StyledByC",
    status: "live",
    url: "https://styledbyc.beauty",
    summary:
      "A beauty booking platform with service discovery, booking workflows, reservation payments and an administrative environment.",
    tags: ["Booking", "React", "TypeScript", "Admin"],
    stack: ["React", "TypeScript", "Vercel"],
    caseStudy: {
      overview:
        "StyledByC is an online booking platform for lash and brow services. Clients can explore the service menu, choose a time and reserve it, while the artist manages appointments and schedules.",
      opportunity:
        "Booking beauty appointments works best when services, availability and payment live in one flow. The aim was a dedicated platform that takes a client from discovering a service to a confirmed reservation.",
      direction:
        "A modern, responsive booking experience that keeps each step clear: pick a service, pick a time, pay the reservation.",
      process: [
        "Built the booking experience and service discovery in React and TypeScript.",
        "Integrated reservation payments.",
        "Built backend and database workflows to support bookings.",
        "Built an admin dashboard for managing the business side.",
      ],
      contributions: [
        "Booking experience",
        "React and TypeScript development",
        "Payment integration",
        "Backend and database workflows",
        "Admin dashboard",
        "Customer experience",
      ],
      challenges: [],
    },
  },
  {
    slug: "jokel-fashion-world",
    name: "Jokel Fashion World",
    status: "in-development",
    summary:
      "A fashion school website designed to communicate the institution's story, showcase student creativity, celebrate craftsmanship and support prospective student enquiries and enrollment.",
    tags: ["Education", "Storytelling", "Enrollment"],
    stack: [],
    progressNote: "Currently being designed and built. No live site yet.",
  },
  {
    slug: "pistachio-cafe",
    name: "Pistachio Café",
    status: "concept",
    summary:
      "A premium hospitality website concept focused on immersive food presentation, atmosphere, motion graphics and interactive storytelling.",
    tags: ["Hospitality", "Motion", "Concept"],
    stack: [],
    progressNote: "A concept in development, used to explore motion and immersive presentation.",
  },
];

export const findProject = (slug: string) => PROJECTS.find((project) => project.slug === slug);
