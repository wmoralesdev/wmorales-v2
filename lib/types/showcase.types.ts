export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: ProjectCategory;
  images: {
    thumbnail: string;
    gallery?: string[];
  };
  links: {
    github?: string;
    live?: string;
    demo?: string;
    documentation?: string;
  };
  technologies: Technology[];
  status: ProjectStatus;
  featured: boolean;
  year: number;
  duration?: string;
  role?: string;
  team?: TeamMember[];
  achievements?: string[];
};

export type Technology = {
  name: string;
  icon?: string;
  category: TechCategory;
};

export type TeamMember = {
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
};

export const ProjectCategory = {
  WEB_APP: "web_app",
  MOBILE_APP: "mobile_app",
  API: "api",
  LIBRARY: "library",
  TOOL: "tool",
  GAME: "game",
  AI_ML: "ai_ml",
  BLOCKCHAIN: "blockchain",
  OTHER: "other",
} as const;

export type ProjectCategory = (typeof ProjectCategory)[keyof typeof ProjectCategory];

export const TechCategory = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  DATABASE: "database",
  DEVOPS: "devops",
  CLOUD: "cloud",
  MOBILE: "mobile",
  AI_ML: "ai_ml",
  BLOCKCHAIN: "blockchain",
  OTHER: "other",
} as const;

export type TechCategory = (typeof TechCategory)[keyof typeof TechCategory];

export const ProjectStatus = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  MAINTAINED: "maintained",
  ARCHIVED: "archived",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type ProjectFilter = {
  categories?: ProjectCategory[];
  technologies?: string[];
  statuses?: ProjectStatus[];
  years?: number[];
  featured?: boolean;
  searchQuery?: string;
};

export type ProjectSort = {
  field: "date" | "title" | "category";
  direction: "asc" | "desc";
};
