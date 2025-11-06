import type { ReactNode } from "react";

export type Command = {
  input: string;
  output: string | ReactNode;
};

export type CommandCategory = "system" | "profile" | "fun" | "navigation";

export type CommandDefinition = {
  description: string;
  descriptionKey?: string; // i18n key for description
  usage?: string; // Usage string
  examplesKey?: string; // i18n key for examples
  aliases?: string[]; // Command aliases
  category?: CommandCategory; // Command category for grouping
  execute: (args?: string[]) => string | ReactNode;
};
