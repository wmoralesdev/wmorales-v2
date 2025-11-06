import type { CommandDefinition } from "../types";
import { aboutCommand } from "./about";
import { bannerCommand } from "./banner";
import { contactCommand } from "./contact";
import { copyCommand } from "./copy";
import { cowsayCommand } from "./cowsay";
import { dateCommand } from "./date";
import { echoCommand } from "./echo";
import { experienceCommand } from "./experience";
import { flipCommand } from "./flip";
import { helpCommand } from "./help";
import { historyCommand } from "./history";
import { langCommand } from "./lang";
import { matrixCommand } from "./matrix";
import { nowCommand } from "./now";
import { projectsCommand } from "./projects";
import { resumeCommand } from "./resume";
import { rollCommand } from "./roll";
import { skillsCommand } from "./skills";
import { socialsCommand } from "./socials";
import { themeCommand } from "./theme";
import { timeCommand } from "./time";
import { whoamiCommand } from "./whoami";

// Clear command (special handling in hook)
export const clearCommandDefinition: CommandDefinition = {
  description: "Clear the terminal",
  descriptionKey: "terminal.clearUsage",
  usage: "clear",
  aliases: ["cls"],
  category: "system",
  execute: () => "CLEAR", // Special marker handled in hook
};

export const COMMANDS: Record<string, CommandDefinition> = {
  help: helpCommand,
  about: aboutCommand,
  skills: skillsCommand,
  projects: projectsCommand,
  experience: experienceCommand,
  contact: contactCommand,
  socials: socialsCommand,
  resume: resumeCommand,
  clear: clearCommandDefinition,
  cls: clearCommandDefinition, // Alias
  theme: themeCommand,
  history: historyCommand,
  echo: echoCommand,
  copy: copyCommand,
  date: dateCommand,
  time: timeCommand,
  now: nowCommand,
  whoami: whoamiCommand,
  lang: langCommand,
  banner: bannerCommand,
  cowsay: cowsayCommand,
  matrix: matrixCommand,
  roll: rollCommand,
  flip: flipCommand,
};

export const COMMAND_SUGGESTIONS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;
