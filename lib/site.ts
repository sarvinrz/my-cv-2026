export const site = {
  name: "Sarvin Rezazadeh",
  firstName: "Sarvin",
  role: "Enterprise Frontend Engineer",
  tagline:
    "Frontend engineer building enterprise interfaces, dashboards, and data-driven web applications.",
  url: "https://sarvinrz.dev",
  email: "sarvin.rezazadeh7979@gmail.com",
  phone: "09931779422",
  github: "https://github.com/sarvinrz",
  linkedin: "https://www.linkedin.com/in/sarvin-rezazadeh-b9b93717b/",
  profilePhoto: "/assets/profile-outdoor.png",
  resumeEn: "/resume-en.pdf",
  resumeFa: "/resume-fa.pdf",
} as const;

export const projectIds = [
  "coreoffice",
  "loan",
  "graph",
  "workflow",
  "crypto",
  "monitoring",
] as const;

export type ProjectId = (typeof projectIds)[number];

export interface ProjectMeta {
  id: ProjectId;
  index: string;
  tech: string[];
  accent: "blue" | "gold" | "sand";
  gallery: { src: string; alt: string }[];
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: "coreoffice",
    index: "01",
    tech: ["Next.js", "Turborepo", "TanStack Query", "CSS Modules", "Storybook", "Docusaurus", "Form.io", "Camunda"],
    accent: "blue",
    gallery: [
      { src: "/assets/project-coreoffice.png", alt: "CoreOffice ERP evaluation module" },
      { src: "/assets/gallery/coreoffice-2.svg", alt: "CoreOffice component library preview" },
      { src: "/assets/gallery/coreoffice-3.svg", alt: "CoreOffice documentation site" },
    ],
  },
  {
    id: "loan",
    index: "02",
    tech: ["Next.js", "React", "Docker", "Redis"],
    accent: "sand",
    gallery: [
      { src: "/assets/project-loan.png", alt: "Loan facilities landing page" },
      { src: "/assets/gallery/loan-2.svg", alt: "Loan application flow" },
      { src: "/assets/gallery/loan-3.svg", alt: "Loan dashboard preview" },
    ],
  },
  {
    id: "graph",
    index: "03",
    tech: ["React", "D3", "TypeScript"],
    accent: "blue",
    gallery: [
      { src: "/assets/gallery/graph-1.svg", alt: "Relationship graph overview" },
      { src: "/assets/gallery/graph-2.svg", alt: "Node detail panel" },
      { src: "/assets/gallery/graph-3.svg", alt: "Graph filter controls" },
    ],
  },
  {
    id: "workflow",
    index: "04",
    tech: ["React", "Form.io", "Camunda"],
    accent: "gold",
    gallery: [
      { src: "/assets/gallery/workflow-1.svg", alt: "BPMN task inbox" },
      { src: "/assets/gallery/workflow-2.svg", alt: "Process form builder" },
      { src: "/assets/gallery/workflow-3.svg", alt: "Approval flow screen" },
    ],
  },
  {
    id: "crypto",
    index: "05",
    tech: ["React", "React Query", "i18n", "WebSocket"],
    accent: "blue",
    gallery: [
      { src: "/assets/gallery/crypto-1.svg", alt: "Crypto market overview" },
      { src: "/assets/gallery/crypto-2.svg", alt: "Trading pair detail" },
      { src: "/assets/gallery/crypto-3.svg", alt: "Dark mode dashboard" },
    ],
  },
  {
    id: "monitoring",
    index: "06",
    tech: ["Prometheus", "Grafana", "Docker"],
    accent: "gold",
    gallery: [
      { src: "/assets/project-monitoring.png", alt: "Grafana Node Exporter dashboard" },
      { src: "/assets/gallery/monitoring-2.svg", alt: "CPU metrics panel" },
      { src: "/assets/gallery/monitoring-3.svg", alt: "Alert configuration" },
    ],
  },
];

export const stackCategoryKeys = [
  "architecture",
  "state",
  "ui",
  "editors",
  "viz",
  "monitoring",
  "workflow",
  "devops",
  "backend",
  "motion",
  "docs",
  "ai",
] as const;

export const marqueeRowA = [
  "React", "Next.js", "TypeScript", "Turborepo", "TanStack Query", "Redux", "D3", "GSAP",
];

export const marqueeRowB = [
  "Tailwind CSS", "Ant Design", "MUI", "Grafana", "Docker", "Form.io", "Camunda", "ECharts",
];

export const experienceIds = [
  "melal",
  "iapps_intern",
  "iapps_crm",
  "iapps_support",
] as const;

export const educationIds = ["masters", "bachelors"] as const;
export const languageIds = ["english", "german", "turkish"] as const;
