export interface Project {
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
}

export interface Technology {
  name: string;
  icon?: string;
  category: TechCategory;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
}

export enum ProjectCategory {
  WEB_APP = "web_app",
  MOBILE_APP = "mobile_app",
  API = "api",
  LIBRARY = "library",
  TOOL = "tool",
  GAME = "game",
  AI_ML = "ai_ml",
  BLOCKCHAIN = "blockchain",
  OTHER = "other",
}

export enum TechCategory {
  FRONTEND = "frontend",
  BACKEND = "backend",
  DATABASE = "database",
  DEVOPS = "devops",
  CLOUD = "cloud",
  MOBILE = "mobile",
  AI_ML = "ai_ml",
  BLOCKCHAIN = "blockchain",
  OTHER = "other",
}

export enum ProjectStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  MAINTAINED = "maintained",
  ARCHIVED = "archived",
}

export interface ProjectFilter {
  categories?: ProjectCategory[];
  technologies?: string[];
  statuses?: ProjectStatus[];
  years?: number[];
  featured?: boolean;
  searchQuery?: string;
}

export interface ProjectSort {
  field: "date" | "title" | "category";
  direction: "asc" | "desc";
}
