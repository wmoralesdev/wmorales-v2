import type { CommandDefinition } from "../types";
import { aboutCommand } from "./about";
import { contactCommand } from "./contact";
import { experienceCommand } from "./experience";
import { helpCommand } from "./help";
import { projectsCommand } from "./projects";
import { resumeCommand } from "./resume";
import { skillsCommand } from "./skills";
import { socialsCommand } from "./socials";
import { themeCommand } from "./theme";

export const COMMANDS: Record<string, CommandDefinition> = {
  help: helpCommand,
  about: aboutCommand,
  skills: skillsCommand,
  projects: projectsCommand,
  experience: experienceCommand,
  contact: contactCommand,
  socials: socialsCommand,
  resume: resumeCommand,
  clear: {
    description: "Clear the terminal",
    execute: () => "CLEAR",
  },
  theme: themeCommand,
};

export const COMMAND_SUGGESTIONS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
  "socials",
] as const;

