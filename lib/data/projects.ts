import {
  type Project,
  ProjectCategory,
  ProjectStatus,
  TechCategory,
} from "@/lib/types/showcase.types";

// This is your projects data. Replace these with your actual projects
export const projects: Project[] = [
  {
    id: "example-project-1",
    title: "Example Project 1",
    description:
      "Brief description of what this project does and its main purpose.",
    longDescription: `
      This is a detailed description of the project. You can include:
      - The problem it solves
      - The approach taken
      - Technical challenges faced
      - The impact or results
    `,
    tags: ["react", "typescript", "nextjs", "tailwind"],
    category: ProjectCategory.WEB_APP,
    images: {
      thumbnail: "/projects/project1/thumbnail.png",
      gallery: [
        "/projects/project1/screenshot1.png",
        "/projects/project1/screenshot2.png",
      ],
    },
    links: {
      github: "https://github.com/yourusername/project1",
      live: "https://project1.com",
      demo: "https://demo.project1.com",
      documentation: "https://docs.project1.com",
    },
    technologies: [
      { name: "React", category: TechCategory.FRONTEND },
      { name: "Next.js", category: TechCategory.FRONTEND },
      { name: "TypeScript", category: TechCategory.FRONTEND },
      { name: "Tailwind CSS", category: TechCategory.FRONTEND },
      { name: "Node.js", category: TechCategory.BACKEND },
      { name: "PostgreSQL", category: TechCategory.DATABASE },
      { name: "Vercel", category: TechCategory.CLOUD },
    ],
    status: ProjectStatus.MAINTAINED,
    featured: true,
    year: 2024,
    duration: "3 months",
    role: "Full Stack Developer",
    team: [
      {
        name: "Team Member 1",
        role: "UI/UX Designer",
        avatar: "/team/member1.jpg",
        linkedin: "https://linkedin.com/in/member1",
      },
    ],
    achievements: [
      "Achieved 100% Lighthouse performance score",
      "Reduced load time by 60%",
      "Reached 10k+ active users",
      "Featured on Product Hunt",
    ],
  },
  // Add more projects here...
];

// Helper function to get featured projects
export const getFeaturedProjects = () =>
  projects.filter((project) => project.featured);

// Helper function to get projects by category
export const getProjectsByCategory = (category: ProjectCategory) =>
  projects.filter((project) => project.category === category);

// Helper function to get projects by status
export const getProjectsByStatus = (status: ProjectStatus) =>
  projects.filter((project) => project.status === status);

// Helper function to get recent projects
export const getRecentProjects = (limit = 3) =>
  projects.sort((a, b) => b.year - a.year).slice(0, limit);
