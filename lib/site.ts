export const site = {
  name: "Sarvin Rezazadeh",
  firstName: "Sarvin",
  role: "Frontend Developer",
  tagline:
    "Frontend engineer with React, Next.js, and TypeScript — I like turning ideas into interfaces people enjoy using.",
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
} as const;

export const projectIds = [
  "coreoffice",
  "graph",
  "workflow",
  "monitoring",
  "loan",
  "crypto",
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
    id: "coreoffice",
    kind: "featured",
    tech: ["Next.js", "Turborepo", "TanStack Query", "Ant Design", "Material UI", "CSS Modules", "Storybook"],
    gallery: [
      { src: "/assets/project-coreoffice.png", alt: "CoreOffice ERP evaluation module" },
      { src: "/assets/gallery/coreoffice-2.svg", alt: "CoreOffice component library preview" },
      { src: "/assets/gallery/coreoffice-3.svg", alt: "CoreOffice documentation site" },
    ],
  },
  {
    id: "graph",
    kind: "case-study",
    tech: ["React", "D3", "TypeScript"],
    gallery: [
      { src: "/assets/gallery/graph-1.svg", alt: "Relationship graph overview" },
      { src: "/assets/gallery/graph-2.svg", alt: "Node detail panel" },
      { src: "/assets/gallery/graph-3.svg", alt: "Graph filter controls" },
    ],
  },
  {
    id: "workflow",
    kind: "case-study",
    tech: ["React", "Form.io", "Camunda"],
    gallery: [
      { src: "/assets/gallery/workflow-1.svg", alt: "BPMN task inbox" },
      { src: "/assets/gallery/workflow-2.svg", alt: "Process form builder" },
      { src: "/assets/gallery/workflow-3.svg", alt: "Approval flow screen" },
    ],
  },
  {
    id: "monitoring",
    kind: "case-study",
    tech: ["Prometheus", "Grafana", "Graylog", "Docker"],
    gallery: [
      { src: "/assets/project-monitoring.png", alt: "Grafana Node Exporter dashboard" },
      { src: "/assets/gallery/monitoring-2.svg", alt: "CPU metrics panel" },
      { src: "/assets/gallery/monitoring-3.svg", alt: "Alert configuration" },
    ],
  },
  {
    id: "loan",
    kind: "satellite",
    tech: ["Next.js", "Tailwind CSS", "shadcn/ui", "Docker", "Redis"],
    gallery: [
      { src: "/assets/project-loan.png", alt: "Loan facilities landing page" },
      { src: "/assets/gallery/loan-1.PNG", alt: "Loan application flow" },
      { src: "/assets/gallery/loan-2.PNG", alt: "Loan application flow 2" },
      { src: "/assets/gallery/loan-3.PNG", alt: "Loan dashboard preview" },
    ],
  },
  {
    id: "crypto",
    kind: "personal",
    tech: ["React", "React Query", "i18n", "WebSocket"],
    gallery: [
      { src: "/assets/gallery/crypto-1.PNG", alt: "Crypto market overview" },
      { src: "/assets/gallery/crypto-2.PNG", alt: "Trading pair detail" },
    ],
  },
];

export const stackCategoryKeys = [
  "core",
  "state",
  "ui",
  "platform",
  "monitoring",
  "specialized",
] as const;

export const marqueeRowA = [
  "React", "Next.js", "TypeScript", "Turborepo", "TanStack Query", "Tailwind CSS", "Ant Design",
];

export const marqueeRowB = [
  "shadcn/ui", "D3.js", "Docker", "Grafana", "Prometheus", "Camunda", "Form.io",
];

export const experienceIds = [
  "melal",
  "iapps_intern",
  "iapps_crm",
  "iapps_support",
] as const;

export const educationIds = ["masters", "bachelors"] as const;
export const languageIds = ["english", "german", "turkish"] as const;
