export const site = {
  name: "Sarvin Rezazadeh",
  firstName: "Sarvin",
  role: "Front-End Developer",
  tagline: "Frontend for banking products — Razaan and the apps around it.",
  url: "https://sarvinrz.dev",
  email: "sarvin.rezazadeh7979@gmail.com",
  phone: "09931779422",
  github: "https://github.com/sarvinrz",
  linkedin: "https://www.linkedin.com/in/sarvin-rezazadeh-b9b93717b/",
  profilePhoto: "/assets/profile.png",
  resumeEn: "/resume-en.pdf",
  resumeFa: "/resume-fa.pdf",
  cryptoDemo: "https://portfolio-omega-ten-22.vercel.app/",
  cryptoGithub: "https://github.com/sarvinrz/portfolio",
  chatbotDemo: "https://enhanced-chatbot.vercel.app/",
  vama: "https://vama.melalbank.ir",
} as const;

export const projectIds = [
  "razean",
  "portal",
  "loan",
  "monitoring",
  "workflow",
  "migration",
  "minis",
] as const;

export type ProjectId = (typeof projectIds)[number];

export type ProjectKind = "featured" | "case-study" | "satellite" | "personal";

export interface ProjectMeta {
  id: ProjectId;
  kind: ProjectKind;
  tech: string[];
  gallery: { src: string; alt: string }[];
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: "razean",
    kind: "featured",
    tech: ["React", "TypeScript", "MUI", "SignalR", "WebSocket", "Form.io", "Camunda"],
    gallery: [
      { src: "/assets/gallery/coreoffice.jpg", alt: "Razaan ERP" },
      { src: "/assets/gallery/coreoffice-4.jpg", alt: "Razaan evaluation module" },
      { src: "/assets/gallery/coreoffice-graph.jpg", alt: "Entity graph in Razaan" },
      { src: "/assets/gallery/graph-razaan.gif", alt: "Razaan graph demo" },
    ],
  },
  {
    id: "portal",
    kind: "satellite",
    tech: ["Next.js", "TypeScript", "Docker"],
    gallery: [
      { src: "/assets/gallery/razaan-portal.jpg", alt: "Razaan portal" },
      { src: "/assets/gallery/razaan-portal-1.jpg", alt: "Portal upload" },
      { src: "/assets/gallery/razaan-portal-2.jpg", alt: "Portal module" },
      { src: "/assets/gallery/razaan-portal-3.jpg", alt: "Portal process" },
    ],
  },
  {
    id: "loan",
    kind: "satellite",
    tech: ["Next.js", "BFF", "Redis", "Docker", "OWASP"],
    gallery: [
      { src: "/assets/project-loan.png", alt: "VAMA loan site" },
      { src: "/assets/gallery/loan-1.PNG", alt: "Loan application form" },
      { src: "/assets/gallery/loan-2.PNG", alt: "Loan documents" },
      { src: "/assets/gallery/loan-3.PNG", alt: "Loan request status" },
    ],
  },
  {
    id: "monitoring",
    kind: "case-study",
    tech: ["Docker", "Prometheus", "Grafana", "Graylog", "Elasticsearch", "Nginx", "Fail2Ban"],
    gallery: [
      { src: "/assets/project-monitoring.png", alt: "Grafana host metrics" },
    ],
  },
  {
    id: "workflow",
    kind: "case-study",
    tech: ["Form.io", "Camunda", "BPMN 2.0", "React"],
    gallery: [
      { src: "/assets/gallery/BPMN.jpg", alt: "Razaan BPMN cartable" },
    ],
  },
  {
    id: "migration",
    kind: "featured",
    tech: ["Next.js", "Turborepo", "TanStack Query", "CSS Modules", "Storybook", "Docusaurus"],
    gallery: [
      { src: "/assets/gallery/new-coreoffice.jpg", alt: "New Razaan" },
      { src: "/assets/gallery/new-coreoffice-1.jpg", alt: "New Razaan screen" },
      { src: "/assets/gallery/new-coreoffice-2.jpg", alt: "New Razaan module" },
      { src: "/assets/gallery/new-coreoffice-3.jpg", alt: "New Razaan form" },
      { src: "/assets/gallery/new-coreoffice-4.jpg", alt: "New Razaan dashboard" },
    ],
  },
  {
    id: "minis",
    kind: "personal",
    tech: ["React", "Next.js", "React Query", "i18n"],
    gallery: [
      { src: "/assets/gallery/crypto-1.PNG", alt: "Crypto dashboard" },
      { src: "/assets/gallery/crypto-2.PNG", alt: "Crypto dashboard detail" },
      { src: "/assets/gallery/chatbot1.PNG", alt: "Emotion chatbot" },
      { src: "/assets/gallery/chatbot-2.PNG", alt: "Chatbot conversation" },
      { src: "/assets/gallery/chatbot-3.PNG", alt: "Chatbot analysis" },
    ],
  },
];

export const stackCategoryKeys = [
  "core",
  "state",
  "interface",
  "viz",
  "workflow",
  "build",
  "runtime",
  "observability",
] as const;

export const marqueeRowA = [
  "React", "Next.js", "TypeScript", "Turborepo", "TanStack Query", "CSS Modules", "D3.js",
];

export const marqueeRowB = [
  "Form.io", "Camunda", "Docker", "Grafana", "Prometheus", "Graylog", "Redis",
];

export const experienceIds = [
  "melal",
  "iapps_intern",
  "iapps_crm",
  "iapps_support",
] as const;

export const educationIds = ["masters", "bachelors"] as const;
